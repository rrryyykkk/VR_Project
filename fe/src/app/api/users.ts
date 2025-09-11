import type { UserPayload } from "../../type/user";
import { api } from "./Axios";

export const getMeUser = async () => {
  const res = await api.get("/auth/user/getMeUser");
  return res;
};

export const editProfileUser = async (data: FormData) => {
  const res = await api.put("/user/updateUser", data);
  return res;
};

// CRUD User by Admin

export const getAllUserByAdmin = async () => {
  const res = await api.get("/user/");
  return res;
};

export const createUserAdmin = async (data: UserPayload) => {
  const res = await api.post("/user/create", data);
  console.log(data);
  return res;
};

export const deleteUserAdmin = async (id: string) => {
  const res = await api.delete(`/user/${id}`);
  return res;
};

export const editUserAdmin = async (id: string, data: UserPayload) => {
  const res = await api.put(`/user/edit/${id}`, data);
  return res;
};
