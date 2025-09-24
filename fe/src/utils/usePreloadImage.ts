// hooks/usePreloadImages.ts
import { useEffect } from "react";
import * as THREE from "three";

// tipe untuk requestIdleCallback
type IdleCallbackDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

export function usePreloadImages(images: string[]) {
  useEffect(() => {
    if (!images || images.length === 0) return;

    const loader = new THREE.TextureLoader();

    const preload = () => {
      images.forEach((img) => {
        if (img) {
          loader.load(img, () => {
            console.log("✅ Preloaded (async):", img);
          });
        }
      });
    };

    // cek apakah requestIdleCallback ada di window
    if ("requestIdleCallback" in window) {
      (
        window.requestIdleCallback as (
          callback: (deadline: IdleCallbackDeadline) => void
        ) => number
      )(preload);
    } else {
      setTimeout(preload, 0);
    }
  }, [images]);
}
