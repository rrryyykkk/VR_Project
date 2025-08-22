import { useCallback } from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { IoMdNavigate } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { FaHandPointer } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
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
  else if (data.type === "location") IconComp = FaLocationDot;

  return (
    <group position={data.position}>
      <Html center>
        <motion.button
          onClick={handleClick}
          className="bg-white rounded-full p-3 shadow-md cursor-pointer"
          title={data.name}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }} // delay biar nunggu scene muncul
          whileHover={{ scale: 1.2 }}
        >
          {IconComp && (
            <IconComp
              className={
                data.type === "navigation"
                  ? "text-blue-500 text-2xl"
                  : data.type === "exit"
                  ? "text-red-500 text-2xl"
                  : data.type === "interaction"
                  ? "text-green-500 text-2xl"
                  : "text-yellow-500 text-2xl"
              }
            />
          )}
        </motion.button>
      </Html>
    </group>
  );
}
