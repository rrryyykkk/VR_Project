import { api } from "./Axios";

export const isActive = async () => {
  const res = await api.get("/activity/isActive");
  return res;
};
