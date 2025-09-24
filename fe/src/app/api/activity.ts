import { api } from "./Axios";

export const setIsActive = async (isActive: boolean) => {
  const res = await api.post("/activity/isActive", { isActive });
  return res;
};

export const setIsRecord = async (isRecord: boolean) => {
  const res = await api.post("/activity/isRecord", { isRecord });
  return res;
};
