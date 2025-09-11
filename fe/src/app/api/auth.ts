import { api } from "./Axios";

type loginCredentials = {
  email: string;
  password: string;
};

// admin
export const adminLogin = async (credentials: loginCredentials) => {
  const res = await api.post("/auth/admin/login", credentials);
  return res;
};

export const adminLogout = async () => {
  const res = await api.post("/auth/admin/logout");
  return res;
};

// user

export const userLogin = async (credentials: loginCredentials) => {
  const res = await api.post("/auth/user/login", credentials);
  return res;
};

export const userLogout = async () => {
  const res = await api.post("/auth/user/logout");
  return res;
};

export const authCheck = async () => {
  const res = await api.get("/auth/admin/authCheck");
  return res;
};
