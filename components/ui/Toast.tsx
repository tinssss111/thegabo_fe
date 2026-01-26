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
    <div className="fixed top-24 right-4 z-100 animate-slide-in">
      <div
        className={`flex items-center gap-3 min-w-[300px] max-w-md px-4 py-3 rounded-lg shadow-lg ${type === "success"
          ? "bg-[#FE722D] text-white"
          : "bg-[#f43715] text-white"
          }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 shrink-0" />
        )}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
