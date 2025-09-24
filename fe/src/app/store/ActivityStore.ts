import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setIsActive, setIsRecord } from "../api/activity";

export const useIsActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setIsActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};

export const useIsRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setIsRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["record"] });
    },
  });
};
