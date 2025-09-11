import { FaVrCardboard } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useXR } from "@react-three/xr";
import { xrManager } from "../../../hooks/xrStore";

interface SceneCard {
  id: string;
  name: string;
  image: string;
}

interface VRFooterProps {
  scenes: SceneCard[];
  currentSceneId: string;
  onSelectScene: (id: string) => void;
  user?: { name: string; room?: string } | null;
}

export default function VRFooter({
  scenes,
  currentSceneId,
  onSelectScene,
  user,
}: VRFooterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  // cek session aktif
  const { session } = useXR();
  const isPresenting = !!session;

  // auto scroll ke scene aktif
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentSceneId]);

  return (
    <div className="absolute bottom-0 w-full bg-black/60 text-white grid grid-cols-3 items-center px-4 py-2 gap-2">
      {/* Kiri: daftar scene */}
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none"
      >
        {scenes.map((scene) => (
          <motion.div
            key={scene.id}
            ref={scene.id === currentSceneId ? activeRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelectScene(scene.id)}
            className={`w-20 h-14 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
              currentSceneId === scene.id
                ? "border-green-400"
                : "border-transparent"
            }`}
          >
            <img
              src={scene.image}
              alt={scene.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Tengah: Info user */}
      <div className="text-center">
        <p className="text-base font-semibold">{user?.name || "Guest"}</p>
        <p className="text-sm text-gray-300">{user?.room || "No Room"}</p>
      </div>

      {/* Kanan: Control */}
      <div className="flex justify-end gap-4">
        <button
          onClick={
            isPresenting ? xrManager.exitVR : xrManager.enterVR // masuk VR
          }
          className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full"
        >
          <FaVrCardboard size={20} />
        </button>
      </div>
    </div>
  );
}
