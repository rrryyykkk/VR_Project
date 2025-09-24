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
  Task,
  VRSession,
  VRTaskSession,
} from "../../../type/VRdata";
import { useCreateVrSession } from "../../../app/store/VrSessionStore";
import type { User } from "../../../type/user";
import { useToast } from "../../../hooks/ToastContext";
import { deleteAllChunks, getAllChunks, saveChunk } from "../../../utils/idb";
import { useIsRecord } from "../../../app/store/ActivityStore";

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
    }>({
      type: "start",
      open: false,
    });

    const sessionRef = useRef<VRSession | null>(null);
    const lastSceneRef = useRef<{ id: string; name: string } | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const dismissedStartScenes = useRef<Set<string>>(new Set());
    const rotationRef = useRef(rotation);

    const { addToast } = useToast();
    const createSessionMutation = useCreateVrSession();
    const { mutate: setIsRecord } = useIsRecord();

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

    // heartbeat isRecording
    useEffect(() => {
      if (!user || !recording) return;

      intervalRef.current = setInterval(() => {
        setIsRecord(true);
      }, 5000); // 5 detik

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRecord(false); // reset saat recording berhenti / cleanup
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

    // record rotation
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
      if (!recording) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      intervalRef.current = setInterval(recordRotationOnce, 300);
      recordRotationOnce();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
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

    const handleStartRecord = () => {
      const startIso = new Date().toISOString();
      const newSession: VRSession = {
        sessionId: crypto.randomUUID(),
        userId: user?.id || "guest",
        startTime: startIso,
        endTime: "",
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
      const rh = sessionRef.current.roomHistory || [];
      const lastOpenIdx = [...rh].reverse().findIndex((rv) => !rv.exitTime);
      let closedHistory = rh;
      if (lastOpenIdx !== -1) {
        const idx = rh.length - 1 - lastOpenIdx;
        closedHistory = [
          ...rh.slice(0, idx),
          { ...rh[idx], exitTime: stopIso },
          ...rh.slice(idx + 1),
        ];
      }

      const chunks = await getAllChunks();
      const allRotations = chunks.flatMap((c) => c.data).concat(buffer);
      buffer = [];
      await deleteAllChunks();

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
      };

      setRecording(false);
      setSession(finished);
      sessionRef.current = finished;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finished));
      setShowModal((p) => ({ ...p, open: false }));
      dismissedStartScenes.current.clear();

      if (user) {
        setIsRecord(false);
        createSessionMutation.mutate(finished, {
          onSuccess: () => addToast("Sesi ini berhasil disimpan!", "success"),
          onError: () => addToast("Gagal menyimpan sesi", "error"),
        });
      } else
        addToast("Recording dihentikan (guest, tidak disimpan)", "success");

      onAllowEnterScene?.();
    };

    useImperativeHandle(ref, () => ({
      logInteraction(type, target) {
        if (!sessionRef.current || !recording) return;

        if (type === "taskUpdate") {
          const vrTasks = (target as { tasks: VRTaskSession[] }).tasks;

          const mappedTasks: Task[] = vrTasks.map((t) => ({
            taskId: t.taskId,
            taskName: t.taskName,
            description: "",
            status:
              t.status === "inProgress"
                ? "pending"
                : t.status === "incomplete"
                ? "failed"
                : t.status,
            type: "interaction",
            timeSpent: t.duration ? t.duration * 60 - (t.remaining ?? 0) : 0,
          }));

          const updated: VRSession = {
            ...sessionRef.current,
            interactions: [
              ...(sessionRef.current.interactions || []),
              {
                id: crypto.randomUUID(),
                type,
                targetTasks: mappedTasks,
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

    // --- Tambahan cleanup effect agar isRecord reset saat unmount ---
    useEffect(() => {
      return () => {
        setIsRecord(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
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
                        setShowModal((p) => ({ ...p, open: false }));
                        onAllowEnterScene?.();
                      } else {
                        setShowModal((p) => ({ ...p, open: false }));
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
