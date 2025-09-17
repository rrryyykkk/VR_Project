import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { editProfileAdmin, getDashboard, getMeAdmin } from "../api/admin";
import { useAuthStore } from "./AuthStore";
import type { Admin } from "./AuthStore";
import { useToast } from "../../hooks/ToastContext"; // ✅ tambahkan ini
import type { DashboardData } from "../../page/admin/Dashboard";

// ✅ Query untuk fetch admin profile
export const useAdminProfile = (
  options?: Omit<UseQueryOptions<Admin, Error>, "queryKey" | "queryFn">
) => {
  const setAdmin = useAuthStore((state) => state.setAdmin);

  return useQuery<Admin, Error>({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const res = await getMeAdmin();
      return res.data;
    },
    onSuccess: (data: Admin) => {
      setAdmin(data); // update Zustand
    },
    onError: (err: Error) => {
      console.error("Fetch admin failed:", err.message);
    },
    ...options,
  } as UseQueryOptions<Admin, Error>);
};

export const useGetDashboard = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};

// ✅ Mutation untuk edit profile admin
export const useEditProfileAdmin = () => {
  const queryClient = useQueryClient();
  const setAdmin = useAuthStore((state) => state.setAdmin);
  const { addToast } = useToast(); // 🔥 global toast

  return useMutation<Admin, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const res = await editProfileAdmin(formData);
      return res;
    },
    onSuccess: (data: Admin) => {
      setAdmin(data);
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      addToast("Profil berhasil diperbarui!", "success"); // ✅ auto success toast
    },
    onError: (err: Error) => {
      console.error("Update profile failed:", err.message);
      addToast(err.message, "error"); // ✅ auto error toast
    },
  });
};
