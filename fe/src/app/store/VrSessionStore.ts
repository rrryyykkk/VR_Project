import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type VRSession } from "../../type/VRdata";
import {
  createVrSession,
  deleteOneVrSession,
  getAllVrSessionByAdmin,
  getOneVrSession,
  getSessionByUser,
} from "../api/vrSession";

// ✅ Query untuk fetch semua vr session bagi admin
export const useVRSessionAllbyAdmin = () => {
  return useQuery<VRSession[], Error>({
    queryKey: ["vrSessions"],
    queryFn: getAllVrSessionByAdmin,
  });
};

// ✅ Query untuk delete vr session per ID
export const useDeleteVrSessionPerId = () => {
  const queryClient = useQueryClient();

  return useMutation<VRSession, Error, string>({
    mutationFn: (sessionId: string) => deleteOneVrSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vrSessions"] });
    },
  });
};

// ✅ Query untuk fetch semua vr session per user
export const useVRSessionAllbyUser = (userId: string) => {
  return useQuery<VRSession[], Error>({
    queryKey: ["vrSessions", userId],
    queryFn: () => getSessionByUser(userId),
    enabled: !!userId,
  });
};

// ✅ Query untuk fetch vr session per sessionId
export const useVRSessionbySessionId = (sessionId: string) => {
  return useQuery<VRSession, Error>({
    queryKey: ["vrSessions", sessionId],
    queryFn: () => getOneVrSession(sessionId),
    enabled: !!sessionId,
  });
};

// ✅ Query untuk record data VR
export const useCreateVrSession = () => {
  const queryClient = useQueryClient();

  return useMutation<VRSession, Error, Omit<VRSession, "sessionId">>({
    mutationFn: createVrSession,
    onSuccess: (newSession) => {
      // update cache admin list
      queryClient.setQueryData<VRSession[]>(["vrSessions"], (oldSessions) =>
        oldSessions ? [...oldSessions, newSession] : [newSession]
      );
    },
  });
};
