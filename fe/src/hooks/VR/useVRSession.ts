import { useState } from "react";
import type { CameraRotation, MovementLog, VRSession } from "../../type/VRdata";

export function useVRSession(userId = "guest") {
  const [session, setSession] = useState<VRSession>({
    sessionId: crypto.randomUUID(),
    userId,
    startTime: new Date().toISOString(),
    endTime: "",
    duration: 0,
    hotspots: [],
    roomHistory: [],
    movementLogs: [],
    cameraRotations: [],
    tasks: [],
  });

  const logHotspot = (targetId: string, roomId: string, roomName: string) => {
    setSession((prev) => ({
      ...prev,
      hotspots: [...(prev.hotspots || []), targetId],
      roomHistory: [
        ...(prev.roomHistory || []),
        {
          roomId,
          roomName,
          enterTime: new Date().toISOString(),
          exitTime: "",
        },
      ],
    }));
  };

  const logMovement = (
    pos: { majuMundur: number; naikTurun: number; geserSamping: number },
    kananKiri: number,
    atasBawah: number
  ) => {
    setSession((prev) => ({
      ...prev,
      movementLogs: [
        ...(prev.movementLogs || []),
        {
          timestamp: new Date().toISOString(),
          majuMundur: pos.majuMundur,
          naikTurun: pos.naikTurun,
          geserSamping: pos.geserSamping,
        } as MovementLog,
      ],
      cameraRotations: [
        ...(prev.cameraRotations || []),
        {
          timestamp: new Date().toISOString(),
          rotation: { kananKiri, atasBawah },
        } as CameraRotation,
      ],
    }));
  };

  return { session, logHotspot, logMovement };
}
