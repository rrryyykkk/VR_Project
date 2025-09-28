import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useAuthStore } from "./AuthStore";
import {
  createUserAdmin,
  deleteUserAdmin,
  editProfileUser,
  editUserAdmin,
  getAllUserByAdmin,
  getMeUser,
} from "../api/users";
import type { User, UserPayload } from "../../type/user";
import { useEffect, useState } from "react";

/// Hook non-blocking untuk Navbar
export const useUserProfileForNavbar = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    getMeUser()
      .then((res) => {
        if (mounted) {
          setUser(res);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return user;
};

// Hook global untuk fetch user dan set store
export const useUserProfile = (
  options?: Partial<UseQueryOptions<User | null, Error>>
) => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery<User | null, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await getMeUser();
        setUser(res);
        return res;
      } catch {
        setUser(null);
        return null;
      }
    },
    retry: false,
    ...options,
  });
};

// ✅ Edit profile (for user sendiri)
export const useEditProfileUser = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<User, Error, FormData>({
    mutationFn: async (formData) => {
      const res = await editProfileUser(formData);
      return res.data as User;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

// ✅ Get all users (Admin only)
export const useAllUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await getAllUserByAdmin();
      return res.data as User[];
    },
    refetchOnWindowFocus: false,
  });
};

// ✅ Create user (Admin)
export const useCreateUserAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UserPayload>({
    mutationFn: (data) => createUserAdmin(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
  });
};

// ✅ Delete user (Admin)
export const useDeleteUserAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await deleteUserAdmin(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
};

// ✅ Edit user (Admin)
export const useEditUserAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; payload: UserPayload }>({
    mutationFn: async ({ id, payload }) => {
      const res = await editUserAdmin(id, payload);
      return res.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
};
