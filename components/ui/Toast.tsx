"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 sm:top-24 right-3 sm:right-4 z-100 animate-slide-in">
      <div
        className={`flex items-center gap-2 sm:gap-3 w-full sm:min-w-75 max-w-xs sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-[#730003] text-white"
            : "bg-[#f43715] text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        )}
        <p className="flex-1 text-xs sm:text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
