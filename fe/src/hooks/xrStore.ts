import { createXRStore } from "@react-three/xr";

// Definisikan shape dari state xrStore
interface XRState {
  session?: XRSession | null;

  // tambahkan kalau ada property lain yg dipakai
}

const xrStore = createXRStore();

/**
 * xrManager
 * - enterVR(): request immersive-vr via the store
 * - exitVR(): end the active session (if any)
 * - isPresenting(): sync getter
 * - subscribe(fn): subscribe to session presence changes (returns unsubscribe)
 */
export const xrManager = {
  enterVR: async () => {
    try {
      await xrStore.enterXR?.("immersive-vr");
    } catch (err) {
      console.error("xrManager.enterVR error:", err);
      throw err;
    }
  },

  exitVR: async () => {
    try {
      const s = xrStore.getState?.().session;
      if (s && typeof s.end === "function") {
        await s.end();
      }
    } catch (err) {
      console.error("xrManager.exitVR error:", err);
      throw err;
    }
  },

  isPresenting: () => !!xrStore.getState?.()?.session,

  // subscribe ke perubahan session
  subscribe: (cb: (isPresenting: boolean) => void) =>
    xrStore.subscribe((state: XRState) => cb(!!state.session)),
};

export { xrStore };
export default xrStore;
