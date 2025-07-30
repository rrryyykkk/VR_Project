import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  if (!show) return null;

  const typeClass = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`alert ${typeClass} shadow-lg`}>
        <span>{message}</span>
      </div>
    </div>
  );
};
