import { api } from "./Axios";

export const getMeAdmin = async () => {
  const res = await api.get("/admin/getMeAdmin");
  return res;
};

export const editProfileAdmin = async (data: FormData) => {
  const res = await api.put("/admin/updateAdmin", data, {
    withCredentials: true,
  });
  return res.data;
};

export const getDashboard = async () => {
  const res = await api.get("/admin/dashbord");
  return res.data;
};