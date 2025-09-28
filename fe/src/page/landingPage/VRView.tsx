import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { OrbitControls, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motion, AnimatePresence } from "framer-motion";

import Scene from "../../components/landingPage/VR/VRScene";
import VRFooter from "../../components/landingPage/VR/VRFooterUI";
import type { HotspotData, SceneData } from "../../type/VRdata";
import { useVRSession } from "../../hooks/VR/useVRSession";
import Hotspot from "../../components/landingPage/VR/VRHotspost";
import VRRecorder, {
  type VRRecorderHandle,
} from "../../components/landingPage/VR/VRRecorder";

import { xrStore } from "../../hooks/xrStore";
import { XR } from "@react-three/xr";
import { useUserProfile } from "../../app/store/UserStore";
import { useIsActive } from "../../app/store/ActivityStore";
import VRTaskPanel from "../../components/landingPage/VR/VRTaskPanel";
import VRTaskWatcher from "../../components/landingPage/VR/VRTaskWatcher";

// ✅ helper untuk build target object
function buildInteractionTarget(
  _type: "scene" | "hotspot",
  data: { id: string; name: string; targetType: string }
) {
  return {
    id: data.id,
    name: data.name,
    targetType: data.targetType,
  };
}

export default function VRView() {
  const { locationId } = useParams();
  const { state } = useLocation();
  const views: SceneData[] = state?.views || [];
  const { mutate: setActive } = useIsActive();

  // ambil status loading (progress dari drei)
  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const { data: user } = useUserProfile({
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const startSceneIds = ["29", "30", "39", "40"];
  const exitSceneIds = ["27", "28", "41", "42", "44"];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene: SceneData | null = views[currentSceneIndex] || null;

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const recorderRef = useRef<VRRecorderHandle | null>(null);

  const [rotasiKamera, setRotasiKamera] = useState({ x: 0, y: 0 });
  const { logMovement } = useVRSession("guest");

  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateTimeout = useRef<number | null>(null);
  const hasLogged = useRef(false);

  useEffect(() => {
    if (user && !hasLogged.current) {
      hasLogged.current = true;
    }
  }, [user]);

  // pause autoRotate saat user interaksi
  useEffect(() => {
    const handleUserInteraction = () => {
      setAutoRotate(false);
      if (autoRotateTimeout.current) clearTimeout(autoRotateTimeout.current);
      autoRotateTimeout.current = window.setTimeout(
        () => setAutoRotate(true),
        10000
      );
    };

    window.addEventListener("mousedown", handleUserInteraction);
    window.addEventListener("wheel", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("mousedown", handleUserInteraction);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  // ambil rotasi kamera setiap 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (controlsRef.current) {
        const x = radToDeg(controlsRef.current.getAzimuthalAngle());
        const y = radToDeg(controlsRef.current.getPolarAngle());
        setRotasiKamera({ x, y });
        logMovement(x, y);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [logMovement]);

  // heartbeat
  useEffect(() => {
    // pas masuk ke VRView → set active true
    setActive(true);

    // heartbeat tiap 5 detik
    const interval = setInterval(() => {
      setActive(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      // pas keluar dari VRView → set active false
      setActive(false);
    };
  }, [setActive]);

  if (!currentScene) {
    return (
      <div className="text-white p-8">
        Data tidak ditemukan untuk lokasi {locationId}
      </div>
    );
  }

  const radToDeg = (rad: number) => ((rad * 180) / Math.PI + 360) % 360;

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Fade transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          className="absolute inset-0 bg-black z-10 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={null}>
          <XR store={xrStore}>
            {/* Panorama */}
            <Scene image={currentScene.image} />

            {/* Hotspot muncul setelah scene selesai load */}
            {isLoaded &&
              currentScene.hotspots?.map((hs: HotspotData, idx: number) => (
                <Hotspot
                  key={`${currentScene.id}-${idx}`} // key unik per scene
                  data={hs}
                  onClick={() => {
                    if (hs.targetId) {
                      const targetIndex = views.findIndex(
                        (v) => v.id === hs.targetId
                      );
                      if (targetIndex !== -1) setCurrentSceneIndex(targetIndex);

                      // ✅ log hotspot interaction pakai object
                      recorderRef.current?.logInteraction(
                        "hotspot",
                        buildInteractionTarget("hotspot", {
                          id: hs.targetId,
                          name: hs.name,
                          targetType: hs.type,
                        })
                      );
                    }
                  }}
                />
              ))}

            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.3}
            />
          </XR>
        </Suspense>
      </Canvas>

      {/* info derajat kamera */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        X: {rotasiKamera.x.toFixed(1)}° | Y: {rotasiKamera.y.toFixed(1)}°
      </div>

      {/* Recorder */}
      <VRRecorder
        ref={recorderRef}
        currentSceneId={currentScene.id}
        currentSceneName={currentScene.name}
        rotation={rotasiKamera}
        startSceneIds={startSceneIds}
        exitSceneIds={exitSceneIds}
        user={user}
      />

      <VRTaskPanel
        recorderRef={recorderRef}
        isRecording={recorderRef.current?.isRecording ?? false}
        userId={user?.id || "guest"}
      />

      <VRTaskWatcher currentSceneId={currentScene.id} />

      {/* Footer */}
      <VRFooter
        scenes={views.map((v) => ({ id: v.id, name: v.name, image: v.image }))}
        currentSceneId={currentScene.id}
        onSelectScene={(id) => {
          const targetScene = views.find((v) => v.id === id);
          if (targetScene) {
            const targetIndex = views.findIndex((v) => v.id === id);
            if (targetIndex !== -1) setCurrentSceneIndex(targetIndex);

            // ✅ log scene interaction pakai object
            recorderRef.current?.logInteraction(
              "scene",
              buildInteractionTarget("scene", {
                id: targetScene.id,
                name: targetScene.name,
                targetType: "scene",
              })
            );
          }
        }}
        user={user}
      />
    </div>
  );
}
