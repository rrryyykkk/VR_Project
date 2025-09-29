import { memo, useCallback } from "react";
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

function HotspotComponent({ data, onClick }: HotspotProps) {
  const handleClick = useCallback(() => {
    console.log("click hotspot:", data.name);
    onClick();
  }, [onClick, data.name]);

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
          className="bg-white rounded-full p-3 shadow-md cursor-pointer transform-gpu"
          title={data.name}
          initial={false} // skip initial animation untuk re-render cepat
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
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

// ✅ Memo dengan custom comparison supaya tidak re-render jika props tidak berubah
export default memo(
  HotspotComponent,
  (prev, next) =>
    prev.data.id === next.data.id &&
    prev.data.type === next.data.type &&
    prev.data.position[0] === next.data.position[0] &&
    prev.data.position[1] === next.data.position[1] &&
    prev.data.position[2] === next.data.position[2]
);
