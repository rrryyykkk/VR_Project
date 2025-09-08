import axios from "axios";
import { useAuthStore } from "../store/AuthStore";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logoutAdmin, logoutUser, role } = useAuthStore.getState();

      if (role === "admin") {
        logoutAdmin();
        window.location.href = "/login-admin"; // 🔑 admin redirect
      } else if (role === "user") {
        logoutUser();
        window.location.href = "/login"; // 🔑 user redirect
      } else {
        // fallback kalau role kosong
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
