// src/components/landingPage/VR/VRRecorder.tsx
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  CameraRotation,
  VRSession,
  VRTaskSession,
} from "../../../type/VRdata";
import { useCreateVrSession } from "../../../app/store/VrSessionStore";
import type { User } from "../../../type/user";
import { useToast } from "../../../hooks/ToastContext";
import {
  deleteAllChunks,
  deleteTasksByUser,
  getAllChunks,
  saveChunk,
} from "../../../utils/idb";
import { useIsRecord } from "../../../app/store/ActivityStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTasks, useUpdateTask } from "../../../app/store/TaskStore";

interface VRRecorderProps {
  currentSceneId: string;
  currentSceneName: string;
  rotation: { x: number; y: number };
  startSceneIds: string[];
  exitSceneIds: string[];
  onAllowEnterScene?: () => void;
  user?: User | null;
}

export type VRRecorderHandle = {
  logInteraction(
    type: "scene" | "hotspot",
    target: { id: string; name: string; targetType: string }
  ): void;
  logInteraction(type: "taskUpdate", target: { tasks: VRTaskSession[] }): void;
  isRecording: boolean;
};

const STORAGE_KEY = "vrSessionTemp";
let buffer: CameraRotation[] = [];
const MAX_BUFFER = 500;

const VRRecorder = forwardRef<VRRecorderHandle, VRRecorderProps>(
  (
    {
      currentSceneId,
      currentSceneName,
      rotation,
      startSceneIds,
      exitSceneIds,
      onAllowEnterScene,
      user,
    },
    ref
  ) => {
    const [recording, setRecording] = useState(false);
    const [session, setSession] = useState<VRSession | null>(null);
    const [showModal, setShowModal] = useState<{
      type: "start" | "stop";
      open: boolean;
      error?: string;
    }>({ type: "start", open: false });

    const sessionRef = useRef<VRSession | null>(null);
    const lastSceneRef = useRef<{ id: string; name: string } | null>(null);

    // Pisahin interval untuk heartbeat dan rotation
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const rotationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
      null
    );

    const dismissedStartScenes = useRef<Set<string>>(new Set());
    const rotationRef = useRef(rotation);

    const { addToast } = useToast();
    const createSessionMutation = useCreateVrSession();
    const { mutate: setIsRecord } = useIsRecord();
    const queryClient = useQueryClient();

    // -----------------------------
    // Tasks handling
    // -----------------------------
    const { data: tasks = [] } = useTasks();
    const updateTask = useUpdateTask();
    const lastTasksRef = useRef<VRTaskSession[]>([]);
    useEffect(() => {
      lastTasksRef.current = tasks;
    }, [tasks]);

    // -----------------------------
    // Helpers
    // -----------------------------
    const recordRotationOnce = async () => {
      if (!sessionRef.current) return;
      const nowIso = new Date().toISOString();
      const r = rotationRef.current ?? { x: 0, y: 0 };
      const newRotation: CameraRotation = {
        timeStamp: nowIso,
        rotX: r.x,
        rotY: r.y,
      };
      buffer.push(newRotation);
      if (buffer.length >= MAX_BUFFER) {
        await saveChunk(buffer);
        buffer = [];
      }
      const updated: VRSession = {
        ...sessionRef.current,
        duration: Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(sessionRef.current.startTime).getTime()) /
              1000
          )
        ),
        cameraRotations: [],
      };
      sessionRef.current = updated;
      setSession(updated);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    useEffect(() => {
      rotationRef.current = rotation;
    }, [rotation]);

    useEffect(() => {
      const handleUnload = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionRef.current = null;
      };
      window.addEventListener("beforeunload", handleUnload);
      return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);

    useEffect(() => {
      if (!user || !recording) return;
      heartbeatRef.current = setInterval(() => setIsRecord(true), 2000);
      return () => {
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
          setIsRecord(false);
        }
      };
    }, [recording, user, setIsRecord]);

    useEffect(() => {
      if (!currentSceneId) return;
      if (exitSceneIds.includes(currentSceneId)) {
        if (recording) setShowModal({ type: "stop", open: true });
        else {
          dismissedStartScenes.current.clear();
          onAllowEnterScene?.();
        }
        return;
      }
      if (
        startSceneIds.includes(currentSceneId) &&
        !recording &&
        !dismissedStartScenes.current.has(currentSceneId)
      ) {
        setShowModal({ type: "start", open: true });
      }
    }, [
      currentSceneId,
      recording,
      startSceneIds,
      exitSceneIds,
      onAllowEnterScene,
    ]);

    useEffect(() => {
      if (!recording) return;
      rotationIntervalRef.current = setInterval(recordRotationOnce, 200);
      recordRotationOnce();
      return () => {
        if (rotationIntervalRef.current) {
          clearInterval(rotationIntervalRef.current);
          rotationIntervalRef.current = null;
        }
      };
    }, [recording]);

    useEffect(() => {
      if (!recording || !sessionRef.current || !currentSceneId) return;
      if (lastSceneRef.current?.id === currentSceneId) return;

      const nowIso = new Date().toISOString();
      const prev = lastSceneRef.current;
      const updated: VRSession = { ...sessionRef.current };

      if (prev) {
        const rh = updated.roomHistory || [];
        const lastIdx = [...rh]
          .reverse()
          .findIndex((rv) => rv.roomId === prev.id && !rv.exitTime);
        if (lastIdx !== -1) {
          const idx = rh.length - 1 - lastIdx;
          updated.roomHistory = [
            ...rh.slice(0, idx),
            { ...rh[idx], exitTime: nowIso },
            ...rh.slice(idx + 1),
          ];
        }
      }

      updated.roomHistory = [
        ...(updated.roomHistory || []),
        {
          roomId: currentSceneId,
          roomName: currentSceneName || currentSceneId,
          enterTime: nowIso,
          exitTime: "",
        },
      ];

      sessionRef.current = updated;
      setSession(updated);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      lastSceneRef.current = { id: currentSceneId, name: currentSceneName };
      recordRotationOnce();
    }, [currentSceneId, currentSceneName, recording]);

    // -----------------------------
    // Start / Stop Recording
    // -----------------------------
    const handleStartRecord = () => {
      const startIso = new Date().toISOString();
      const newSession: VRSession = {
        sessionId: crypto.randomUUID(),
        userId: user?.id || "guest",
        startTime: startIso,
        endTime: startIso,
        duration: 0,
        cameraRotations: [],
        interactions: [],
        roomHistory: [
          {
            roomId: currentSceneId,
            roomName: currentSceneName || currentSceneId,
            enterTime: startIso,
            exitTime: "",
          },
        ],
      };
      setSession(newSession);
      sessionRef.current = newSession;
      lastSceneRef.current = { id: currentSceneId, name: currentSceneName };

      if (user) {
        setIsRecord(true);
        setRecording(true);
        addToast("Recording dimulai", "success");

        // mulai semua task yang pending menjadi inProgress (dari admin assign)
        lastTasksRef.current.forEach((t) => {
          if (t.status === "pending") {
            updateTask.mutate({
              taskId: t.taskId,
              payload: {
                status: "inProgress",
                startedAt: new Date().toISOString(),
                remaining: t.duration ? t.duration * 60 : undefined,
              },
            });
          }
        });
      } else {
        setShowModal({
          type: "start",
          open: true,
          error: "Harus login untuk recording!",
        });
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setShowModal((p) => ({ ...p, open: false }));
      onAllowEnterScene?.();
    };

    const handleStopRecord = async () => {
      if (!recording || !sessionRef.current) return;

      const stopIso = new Date().toISOString();

      // Tutup room history terakhir
      const rh = sessionRef.current.roomHistory || [];
      const lastOpenIdx = [...rh].reverse().findIndex((rv) => !rv.exitTime);
      const closedHistory =
        lastOpenIdx !== -1
          ? [
              ...rh.slice(0, rh.length - lastOpenIdx - 1),
              { ...rh[rh.length - 1 - lastOpenIdx], exitTime: stopIso },
              ...rh.slice(rh.length - lastOpenIdx),
            ]
          : rh;

      // Ambil semua chunks rotation
      const chunks = await getAllChunks();
      const allRotations = chunks.flatMap((c) => c.data).concat(buffer);
      buffer = [];
      await deleteAllChunks();

      // -----------------------------------------
      // 1) Siapkan tasksForBackend (full VRTaskSession[])
      //    - semua task yang belum completed -> FAILED
      //    - sertakan startedAt, finishedAt, remaining supaya BE dapat compute timeSpent
      // -----------------------------------------
      const tasksForBackend: VRTaskSession[] = lastTasksRef.current.map((t) => {
        if (t.status === "completed" || t.status === "failed") {
          return t; // biarkan apa adanya
        }

        // pending / inProgress => gagal karena recording dihentikan
        return {
          ...t,
          status: "failed",
          startedAt: t.startedAt ?? stopIso,
          finishedAt: stopIso,
          remaining: t.duration ? t.remaining ?? 0 : undefined,
        };
      });

      console.log("📤 Semua task yang akan dikirim ke BE:", tasksForBackend);

      // -----------------------------------------
      // 2) Persist update ke store/IDB (fire-and-forget)
      // -----------------------------------------
      tasksForBackend.forEach((t) => {
        // kalau tugas sudah sebelumnya 'completed' atau 'failed' skip (sudah final)
        const orig = lastTasksRef.current.find((x) => x.taskId === t.taskId);
        if (orig && (orig.status === "completed" || orig.status === "failed")) {
          return;
        }

        // kirim update ke IDB / store
        const payload: Parameters<typeof updateTask.mutate>[0]["payload"] = {
          status: t.status,
        };
        if (t.duration !== undefined) payload.remaining = t.remaining ?? 0;
        // set finishedAt so UI/store has timestamp (use server can also set it)
        payload.finishedAt = t.finishedAt ?? stopIso;
        if (t.startedAt) payload.startedAt = t.startedAt;

        updateTask.mutate({ taskId: t.taskId, payload });
      });

      // -----------------------------------------
      // 3) Buat VRSession final & kirim ke BE (full tasks)
      // -----------------------------------------
      const finished: VRSession = {
        ...sessionRef.current,
        endTime: stopIso,
        duration: Math.max(
          0,
          Math.floor(
            (new Date(stopIso).getTime() -
              new Date(sessionRef.current.startTime).getTime()) /
              1000
          )
        ),
        roomHistory: closedHistory,
        cameraRotations: allRotations,
        tasks: tasksForBackend,
      };

      // set local state & storage
      setRecording(false);
      setSession(finished);
      sessionRef.current = finished;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finished));
      setShowModal({ type: "start", open: false });
      dismissedStartScenes.current.clear();
      setIsRecord(false);

      // send to BE
      if (user) {
        createSessionMutation.mutate(finished, {
          onSuccess: async () => {
            try {
              await deleteTasksByUser(user.id);
              queryClient.setQueryData<VRTaskSession[]>(["vr-tasks"], []);
              addToast("Sesi ini berhasil disimpan!", "success");
            } catch (err) {
              console.error("Gagal hapus tasks dari IDB:", err);
            }
          },
          onError: () => addToast("Gagal menyimpan sesi", "error"),
        });
      } else {
        await deleteTasksByUser("guest");
        queryClient.setQueryData<VRTaskSession[]>(["vr-tasks"], []);
        addToast("Recording dihentikan (guest, tidak disimpan)", "success");
      }

      setSession(null);
      sessionRef.current = null;
      onAllowEnterScene?.();
    };

    // -----------------------------
    // Log Interactions (expose to parent via ref)
    // -----------------------------
    useImperativeHandle(ref, () => ({
      logInteraction(type, target) {
        if (!sessionRef.current || !recording) return;

        if (type === "taskUpdate") {
          const vrTasks = (target as { tasks: VRTaskSession[] }).tasks;

          const updated: VRSession = {
            ...sessionRef.current,
            interactions: [
              ...(sessionRef.current.interactions || []),
              {
                id: crypto.randomUUID(),
                type,
                targetTasks: vrTasks,
                timestamp: new Date().toISOString(),
              },
            ],
          };
          sessionRef.current = updated;
          setSession(updated);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return;
        }

        const sceneTarget = target as {
          id: string;
          name: string;
          targetType: string;
        };
        const updated: VRSession = {
          ...sessionRef.current,
          interactions: [
            ...(sessionRef.current.interactions || []),
            {
              id: crypto.randomUUID(),
              type,
              targetId: sceneTarget.id,
              targetName: sceneTarget.name,
              targetType: sceneTarget.targetType,
              timestamp: new Date().toISOString(),
            },
          ],
        };
        sessionRef.current = updated;
        setSession(updated);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        recordRotationOnce();
      },
      isRecording: recording,
    }));

    useEffect(() => {
      return () => {
        setIsRecord(false);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        if (rotationIntervalRef.current)
          clearInterval(rotationIntervalRef.current);
      };
    }, [setIsRecord]);

    return (
      <>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {recording ? "REC ●" : session ? "SAVED" : "IDLE"}
        </div>

        <AnimatePresence>
          {showModal.open && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/70 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-lg p-6 text-black max-w-sm w-full text-center">
                <p className="mb-4">
                  {showModal.type === "start"
                    ? "Apakah Anda ingin memulai record sesi di aula?"
                    : "Apakah Anda ingin menghentikan record sesi dan keluar dari aula?"}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() =>
                      showModal.type === "start"
                        ? handleStartRecord()
                        : handleStopRecord()
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => {
                      if (showModal.type === "start") {
                        dismissedStartScenes.current.add(currentSceneId);
                        setShowModal({ type: "start", open: false });
                        onAllowEnterScene?.();
                      } else {
                        setShowModal({ type: "start", open: false });
                        onAllowEnterScene?.();
                      }
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Tidak
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

export default VRRecorder;
