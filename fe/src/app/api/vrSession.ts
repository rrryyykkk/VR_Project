import type { VRSession } from "../../type/VRdata";
import { api } from "./Axios";

export const getAllVrSessionByAdmin = async (): Promise<VRSession[]> => {
  const res = await api.get("/vrSession/");
  return res.data.sessions;
};

export const createVrSession = async (
  data: Omit<VRSession, "sessionId">
): Promise<VRSession> => {
  const res = await api.post("/vrSession/", data);
  return res.data;
};

export const getOneVrSession = async (
  sessionId: string
): Promise<VRSession> => {
  const res = await api.get(`/vrSession/${sessionId}/stats`);
  return res.data.session;
};

export const getSessionByUser = async (id: string): Promise<VRSession[]> => {
  const res = await api.get(`/vrSession/user/${id}`);
  return res.data.sessions;
};

export const deleteOneVrSession = async (
  sessionId: string
): Promise<VRSession> => {
  const res = await api.delete(`/vrSession/${sessionId}`);
  return res.data;
};
