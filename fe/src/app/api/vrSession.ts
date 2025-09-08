import { api } from "./Axios";

export const getAllVrSessionByAdmin = async () => {
  const res = await api.get("/vrSession/");
  return res;
};

export const createVrSession = async (data: FormData) => {
  const res = await api.post("/vrSession/", data);
  return res;
};

export const getOneVrSession = async (id: string) => {
  const res = await api.get(`/vrSession/${id}/stats`);
  return res;
};

export const getSessionByUser = async (id: string) => {
  const res = await api.get(`/vrSession/user/${id}`);
  return res;
};
