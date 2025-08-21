import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useEffect, useRef, useCallback } from "react";

interface CameraTrackerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  onCameraMove?: (pos: {
    majuMundur: number;
    naikTurun: number;
    geserSamping: number;
  }) => void;
}

export default function CameraTracker({
  controlsRef,
  onCameraMove,
}: CameraTrackerProps) {
  const idleTimer = useRef<number | null>(null);
  const { camera } = useThree();

  const resetIdleTimer = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
    if (idleTimer.current !== null) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = window.setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
      }
    }, 5000);
  }, [controlsRef]);

  useEffect(() => {
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("mousedown", resetIdleTimer);
    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("mousedown", resetIdleTimer);
    };
  }, [resetIdleTimer]);

  useFrame(() => {
    onCameraMove?.({
      majuMundur: camera.position.z,
      naikTurun: camera.position.y,
      geserSamping: camera.position.x,
    });
  });

  return null;
}
