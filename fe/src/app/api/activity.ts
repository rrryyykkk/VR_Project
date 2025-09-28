import { api } from "./Axios";

// ✅ user: set active
export const setIsActive = async (isActive: boolean) => {
  return await api.post("/activity/isActive", { isActive });
};

// ✅ user: set record
export const setIsRecord = async (isRecord: boolean) => {
  return api.post("/activity/isRecord", { isRecord });
};
