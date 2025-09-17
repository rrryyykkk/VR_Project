// src/components/landingPage/VR/VRRecorder.tsx
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CameraRotation, VRSession } from "../../../type/VRdata";
import { useCreateVrSession } from "../../../app/store/VrSessionStore";
import type { User } from "../../../type/user";
import { useToast } from "../../../hooks/ToastContext";

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
  logInteraction: (type: "scene" | "hotspot", targetId: string) => void;
};

const STORAGE_KEY = "vrSessionTemp";

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

    const sessionRef = useRef<VRSession | null>(null);
    const lastSceneRef = useRef<{ id: string; name: string } | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const dismissedStartScenes = useRef<Set<string>>(new Set());
    const { addToast } = useToast();
    const rotationRef = useRef(rotation); // stable ref to latest rotation

    const [showModal, setShowModal] = useState<{
      type: "start" | "stop";
      open: boolean;
    }>({ type: "start", open: false });

    const createSessionMutation = useCreateVrSession();

    // keep rotationRef up to date — does not re-create callbacks
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
      if (!currentSceneId) return;

      if (exitSceneIds.includes(currentSceneId)) {
        if (recording) {
          setShowModal({ type: "stop", open: true });
        } else {
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

    // stable recorder function: reads rotation from rotationRef
    const recordRotationOnce = () => {
      if (!sessionRef.current) return;
      const nowIso = new Date().toISOString();
      const r = rotationRef.current ?? { x: 0, y: 0 };
      const newRotation: CameraRotation = {
        timeStamp: nowIso,
        rotX: r.x,
        rotY: r.y,
      };
      const updated: VRSession = {
        ...sessionRef.current,
        cameraRotations: [
          ...(sessionRef.current.cameraRotations || []),
          newRotation,
        ],
        duration: Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(sessionRef.current.startTime).getTime()) /
              1000
          )
        ),
      };
      sessionRef.current = updated;
      setSession(updated);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // start/stop per-second interval (stable; doesn't depend on rotation)
    useEffect(() => {
      if (!recording) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      // create exactly one interval
      intervalRef.current = setInterval(recordRotationOnce, 1000);
      // also record immediately at start (so first sample is immediate)
      recordRotationOnce();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      // note: do NOT include recordRotationOnce or rotationRef in deps
      // we purposely want a stable timer that reads latest rotationRef
    }, [recording]);

    // record roomHistory when scene changes (prevent duplicates)
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

      // record one rotation right after entering a room
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
      setRecording(true);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setShowModal((p) => ({ ...p, open: false }));

      addToast("Recording started", "success");
      onAllowEnterScene?.();
    };

    const handleStopRecord = () => {
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
      };

      setRecording(false);
      setSession(finished);
      sessionRef.current = finished;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finished));
      setShowModal((p) => ({ ...p, open: false }));
      dismissedStartScenes.current.clear();

      if (user) {
        createSessionMutation.mutate(finished, {
          onSuccess: () => {
            addToast("Sesi ini berhasil disimpan!", "success");
          },
          onError: () => {
            addToast("Gagal menyimpan sesi", "error");
          },
        });
      } else {
        addToast("Recording dihentikan (guest, tidak disimpan)", "success");
      }

      onAllowEnterScene?.();
    };

    useImperativeHandle(ref, () => ({
      logInteraction(type: "scene" | "hotspot", targetId: string) {
        if (!sessionRef.current || !recording) return;
        const updated: VRSession = {
          ...sessionRef.current,
          interactions: [
            ...(sessionRef.current.interactions || []),
            {
              id: crypto.randomUUID(),
              type,
              targetId,
              timestamp: new Date().toISOString(),
            },
          ],
        };
        sessionRef.current = updated;
        setSession(updated);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Also record a rotation snapshot when an interaction happens (optional)
        recordRotationOnce();
      },
    }));

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
