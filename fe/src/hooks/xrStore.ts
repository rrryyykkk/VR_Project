import { createXRStore } from "@react-three/xr";

export const xrStore = createXRStore();

export const xrManager = {
  enterVR: () => xrStore.enterXR("immersive-vr"),
  exitVR: () => xrStore.getState().session?.end(),
};
