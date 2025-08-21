// src/pages/VRView.tsx
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  useLocation,
  useParams,
  // useNavigate
} from "react-router";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import Scene from "../../components/landingPage/VR/VRScene";
import CameraTracker from "../../components/landingPage/VR/CameraTracker";
import VRFooter from "../../components/landingPage/VR/VRFooterUI";

import type { HotspotData, SceneData } from "../../type/VRdata";
import { useVRSession } from "../../hooks/VR/useVRSession";
import Hotspot from "../../components/landingPage/VR/VRHotspost";

// Komponen kecil untuk handle Raycaster
function RaycastClickLogger() {
  const { camera, gl, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(
        scene.children,
        true
      );

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const pos: [number, number, number] = [
          parseFloat(point.x.toFixed(1)),
          parseFloat(point.y.toFixed(1)),
          parseFloat(point.z.toFixed(1)),
        ];
        console.log("Helper clicked position:", ...pos);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [camera, gl, scene]);

  return null;
}

export default function VRView() {
  const { locationId } = useParams();
  const { state } = useLocation();
  // const navigate = useNavigate();
  const views: SceneData[] = state?.views || [];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene: SceneData | null = views[currentSceneIndex] || null;

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const [posisiKamera, setPosisiKamera] = useState({
    majuMundur: 0,
    naikTurun: 0,
    geserSamping: 0,
  });

  const [rotasiKamera, setRotasiKamera] = useState({
    kananKiri: 0,
    atasBawah: 0,
  });

  const { logMovement } = useVRSession("guest");

  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateTimeout = useRef<number | null>(null);

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

  if (!currentScene) {
    return (
      <div className="text-white p-8">
        Data tidak ditemukan untuk lokasi {locationId}
      </div>
    );
  }

  const radToDeg = (rad: number) => ((rad * 180) / Math.PI + 360) % 360;

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={null}>
          {/* Scene panorama 360 */}
          <Scene image={currentScene.image} />

          {/* Hotspot visual */}
          {currentScene.hotspots?.map((hs: HotspotData, idx: number) => (
            <Hotspot
              key={idx}
              data={hs}
              onClick={() => {
                if (hs.targetId) {
                  // pindah ke scene targetId untuk semua type
                  const targetIndex = views.findIndex(
                    (v) => v.id === hs.targetId
                  );
                  if (targetIndex !== -1) setCurrentSceneIndex(targetIndex);
                } else {
                  console.log("Hotspot clicked (no targetId):", hs);
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

          {/* Tracker buat catat posisi & rotasi kamera */}
          <CameraTracker
            controlsRef={controlsRef}
            onCameraMove={(pos) => {
              setPosisiKamera(pos);
              if (controlsRef.current) {
                const kananKiriDeg = radToDeg(
                  controlsRef.current.getAzimuthalAngle()
                );
                const atasBawahDeg = radToDeg(
                  controlsRef.current.getPolarAngle()
                );
                setRotasiKamera({
                  kananKiri: kananKiriDeg,
                  atasBawah: atasBawahDeg,
                });
                logMovement(pos, kananKiriDeg, atasBawahDeg);
              }
            }}
          />

          {/* Helper logger di console */}
          <RaycastClickLogger />
        </Suspense>
      </Canvas>

      {/* Footer info kamera */}
      <VRFooter
        text={`${
          currentScene.name || "Virtual Tour"
        } | Kanan-Kiri: ${rotasiKamera.kananKiri.toFixed(
          1
        )}°, Atas-Bawah: ${rotasiKamera.atasBawah.toFixed(
          1
        )}° | Maju-Mundur: ${posisiKamera.majuMundur.toFixed(
          2
        )}, Naik-Turun: ${posisiKamera.naikTurun.toFixed(
          2
        )}, Geser-Samping: ${posisiKamera.geserSamping.toFixed(2)}`}
      />
    </div>
  );
}
