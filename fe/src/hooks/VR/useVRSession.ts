import { useState } from "react";
import type { CameraRotation, VRSession } from "../../type/VRdata";

export function useVRSession(userId = "guest") {
  const [session, setSession] = useState<VRSession>({
    sessionId: crypto.randomUUID(),
    userId,
    startTime: new Date().toISOString(),
    endTime: "",
    duration: 0,
    hotspots: [],
    roomHistory: [],
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

  const logMovement = (x: number, y: number) => {
    setSession((prev) => ({
      ...prev,
      cameraRotations: [
        ...(prev.cameraRotations || []),
        {
          timestamp: new Date().toISOString(),
          rotation: { x, y },
        } as CameraRotation,
      ],
    }));
  };

  return { session, logHotspot, logMovement };
}
