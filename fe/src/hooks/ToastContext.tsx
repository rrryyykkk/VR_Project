import { createContext, useContext } from "react";

export type Toast = {
  id: number;
  message: string;
  type: "success" | "error";
};

export type ToastContextType = {
  addToast: (message: string, type?: "success" | "error") => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
