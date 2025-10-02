import { useState, useCallback } from "react";
import type { ToastType, ToastProps } from "../components/Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastProps = {
        id,
        type,
        message,
        duration,
        onClose: removeToast,
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) =>
      addToast("success", message, duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      addToast("error", message, duration),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      addToast("warning", message, duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast("info", message, duration),
    [addToast]
  );

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
};
