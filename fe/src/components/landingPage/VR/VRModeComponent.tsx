// src/components/landingPage/VR/VRModeComponent.tsx
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { XR, useXR, XRControllerModel } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import { FaVrCardboard } from "react-icons/fa";
import { xrStore, xrManager } from "../../../hooks/xrStore"; // <- shared store

function SceneContent() {
  // SceneContent berada DI DALAM <XR>, jadi useXR aman di sini
  const { session } = useXR();

  return (
    <>
      {/* Lantai */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Kubus indikator */}
      <mesh position={[0, 1, -3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={session ? "lime" : "orange"} />
      </mesh>

      {/* Controller VR */}
      <XRControllerModel />
    </>
  );
}

export default function VRModeComponent() {
  const [isVR, setIsVR] = useState(false);

  const handleEnterVR = async () => {
    try {
      await xrManager.enterVR();
      setIsVR(true);
    } catch (err) {
      console.error("VR not supported or failed to enter:", err);
      setIsVR(false);
    }
  };

  const handleExitVR = async () => {
    try {
      await xrManager.exitVR();
    } catch (err) {
      console.error("failed to exit VR:", err);
    } finally {
      setIsVR(false);
    }
  };

  return (
    <div className="w-full h-screen bg-black">
      {/* Tombol kontrol */}
      <div className="absolute top-4 right-4 z-10">
        {!isVR ? (
          <button
            onClick={handleEnterVR}
            className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white flex items-center gap-2"
          >
            <FaVrCardboard size={18} /> Enter VR
          </button>
        ) : (
          <button
            onClick={handleExitVR}
            className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white flex items-center gap-2"
          >
            Exit VR
          </button>
        )}
      </div>

      {/* Canvas + XR */}
      <Canvas shadows camera={{ position: [0, 1.6, 3], fov: 70 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} castShadow />

        {/* gunakan shared xrStore */}
        <XR store={xrStore}>
          <SceneContent />
        </XR>

        <OrbitControls />
      </Canvas>
    </div>
  );
}
