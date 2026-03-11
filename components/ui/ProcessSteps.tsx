"use client";

import {
  ClipboardList,
  XCircle,
  Check,
  UserCheck,
  ChefHat,
  Truck,
  MapPin,
} from "lucide-react";

interface ProcessStepsProps {
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipping"
    | "delivered"
    | "cancelled";
  className?: string;
}

export default function ProcessSteps({ status, className }: ProcessStepsProps) {
  const isCancelled = status === "cancelled";

  const normalSteps = [
    { id: "pending", label: "Chờ xác nhận", icon: ClipboardList },
    { id: "confirmed", label: "Đã xác nhận", icon: UserCheck },
    { id: "preparing", label: "Đang chuẩn bị", icon: ChefHat },
    { id: "shipping", label: "Đang giao", icon: Truck },
    { id: "delivered", label: "Đã giao", icon: MapPin },
  ];

  const cancelledSteps = [
    { id: "pending", label: "Chờ xác nhận", icon: ClipboardList },
    { id: "cancelled", label: "Đã hủy đơn", icon: XCircle },
  ];

  const steps = isCancelled ? cancelledSteps : normalSteps;
  const currentStepIndex = steps.findIndex((s) => s.id === status);

  const progressPercent = isCancelled
    ? 100
    : (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div
      className={`w-full max-w-4xl p-2 sm:p-3 md:p-4 mx-auto mb-8 sm:mb-12 md:mb-16 ${className}`}
    >
      <style jsx>{`
        @keyframes progressLoop {
          0% {
            width: 0%;
            opacity: 0.3;
          }
          70% {
            opacity: 1;
          }
          100% {
            width: ${progressPercent}%;
            opacity: 0.3;
          }
        }
        .animate-line-loop {
          animation: progressLoop 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="relative flex justify-between items-center gap-2 sm:gap-0">
        {/* LINE NỀN */}
        <div
          className="absolute top-5 sm:top-6 bg-gray-100 z-0"
          style={{
            left: "clamp(12px, 5vw, 24px)",
            right: "clamp(12px, 5vw, 24px)",
            height: "2px",
          }}
        />

        {/* LINE CHẠY / ĐỨNG YÊN */}
        <div
          className={`absolute top-6 left-0 h-0.5 z-10 bg-[#730003]
    ${!isCancelled ? "animate-line-loop" : ""}
  `}
          style={{
            width: "100%",
          }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-20"
            >
              <div className="bg-white p-0.5 sm:p-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${
                      isCancelled && step.id === "cancelled"
                        ? "border-[#730003] text-[#730003]"
                        : (index <= currentStepIndex && !isCancelled) ||
                            (isCancelled && step.id === "pending")
                          ? "border-[#730003] text-[#730003]"
                          : "border-gray-200 text-gray-300"
                    }
                    ${isActive ? "scale-110" : ""}
                  `}
                >
                  {isCompleted && !isCancelled ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  ) : (
                    <step.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  )}
                </div>
              </div>

              <div className="absolute top-10 sm:top-12 md:top-14 flex flex-col items-center w-20 sm:w-24 md:w-32">
                <span
                  className={`text-[8px] sm:text-[10px] md:text-xs font-medium text-center
                    ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}
                    ${isCancelled && step.id === "cancelled" ? "text-[#730003]" : ""}
                  `}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
