// components/landingPage/VR/VRHotspot.tsx
import { useCallback } from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { IoMdNavigate } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { FaHandPointer } from "react-icons/fa";
import type { HotspotData } from "../../../type/VRdata";

interface HotspotProps {
  data: HotspotData;
  onClick: () => void;
}

export default function Hotspot({ data, onClick }: HotspotProps) {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  // pilih icon sesuai type
  let IconComp;
  if (data.type === "navigation") IconComp = IoMdNavigate;
  else if (data.type === "exit") IconComp = SlLogout;
  else if (data.type === "interaction") IconComp = FaHandPointer;

  return (
    <group position={data.position}>
      <Html center>
        <motion.button
          onClick={handleClick}
          className="bg-white rounded-full p-3 shadow-md"
          title={data.name}
          whileHover={{ scale: 1.2 }}
          animate={{ y: [0, -5, 0] }} // floating animation
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          {IconComp && (
            <IconComp
              className={
                data.type === "navigation"
                  ? "text-blue-500 text-2xl"
                  : data.type === "exit"
                  ? "text-red-500 text-2xl"
                  : "text-green-500 text-2xl"
              }
            />
          )}
        </motion.button>
      </Html>
    </group>
  );
}
