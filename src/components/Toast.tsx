import React, { useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiXCircle size={20} />,
    warning: <FiAlertCircle size={20} />,
    info: <FiInfo size={20} />,
  };

  const colors = {
    success: "bg-green-600 border-green-500",
    error: "bg-red-600 border-red-500",
    warning: "bg-yellow-600 border-yellow-500",
    info: "bg-blue-600 border-blue-500",
  };

  return (
    <div
      className={`${colors[type]} border-l-4 rounded-r-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-[400px] animate-slide-in`}
    >
      <div className="text-white">{icons[type]}</div>
      <p className="text-white text-sm flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({
  toasts,
}) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
