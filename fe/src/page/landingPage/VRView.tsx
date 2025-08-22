import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motion, AnimatePresence } from "framer-motion";

import Scene from "../../components/landingPage/VR/VRScene";
import VRFooter from "../../components/landingPage/VR/VRFooterUI";
import type { HotspotData, SceneData } from "../../type/VRdata";
import { useVRSession } from "../../hooks/VR/useVRSession";
import Hotspot from "../../components/landingPage/VR/VRHotspost";

export default function VRView() {
  const { locationId } = useParams();
  const { state } = useLocation();
  const views: SceneData[] = state?.views || [];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene: SceneData | null = views[currentSceneIndex] || null;

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const [rotasiKamera, setRotasiKamera] = useState({
    x: 0, // kanan kiri 0 - 360
    y: 0, // atas bawah 0 - 180
  });

  const { logMovement } = useVRSession("guest");

  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateTimeout = useRef<number | null>(null);

  // Handle auto rotate pause setelah interaksi user
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (controlsRef.current) {
        const x = radToDeg(controlsRef.current.getAzimuthalAngle()); // 0–360
        const y = radToDeg(controlsRef.current.getPolarAngle()); // 0–180
        setRotasiKamera({ x, y });
        logMovement({ majuMundur: 0, naikTurun: 0, geserSamping: 0 }, x, y);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [logMovement]);

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
      {/* Animasi overlay fade */}
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
          {/* Scene panorama 360 */}
          <Scene image={currentScene.image} />

          {/* Hotspot */}
          {currentScene.hotspots?.map((hs: HotspotData, idx: number) => (
            <Hotspot
              key={idx}
              data={hs}
              onClick={() => {
                if (hs.targetId) {
                  const targetIndex = views.findIndex(
                    (v) => v.id === hs.targetId
                  );
                  if (targetIndex !== -1) setCurrentSceneIndex(targetIndex);
                }
              }}
            />
          ))}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.3}
          />
        </Suspense>
      </Canvas>

      {/* Derajat kamera di kiri atas */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        X: {rotasiKamera.x.toFixed(1)}° | Y: {rotasiKamera.y.toFixed(1)}°
      </div>

      {/* Footer */}
      <VRFooter
        scenes={views.map((v) => ({ id: v.id, name: v.name, image: v.image }))}
        currentSceneId={currentScene.id}
        onSelectScene={(id) => {
          const targetIndex = views.findIndex((v) => v.id === id);
          if (targetIndex !== -1) setCurrentSceneIndex(targetIndex);
        }}
        user={null} // contoh: { name: "Hana", room: "Ruang 1" }
      />
    </div>
  );
}
