"use client";

import { ClipboardList, XCircle, Check, UserCheck, ChefHat, Truck, MapPin } from "lucide-react";

interface ProcessStepsProps {
    status: "pending" | "confirmed" | "preparing" | "shipping" | "delivered" | "cancelled";
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
        <div className={`w-full max-w-4xl p-2 mx-auto mb-16 ${className}`}>
            <style jsx>{`
        @keyframes progressLoop {
          0% { width: 0%; opacity: 0.3; }
          70% { opacity: 1; }
          100% { width: ${progressPercent}%; opacity: 0.3; }
        }
        .animate-line-loop {
          animation: progressLoop 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

            <div className="relative flex justify-between items-center">

                {/* LINE NỀN */}
                <div
                    className="absolute top-[24px] bg-gray-100 z-0"
                    style={{ left: "24px", right: "24px", height: "2px" }}
                />

                {/* LINE CHẠY / ĐỨNG YÊN */}
                <div
                    className={`absolute top-[24px] left-0 h-[2px] z-10 bg-[#FE722D]
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
                        <div key={step.id} className="flex flex-col items-center relative z-20">

                            <div className="bg-white p-1">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${isCancelled && step.id === "cancelled"
                                            ? "border-[#FE722D] text-[#FE722D]"
                                            : (index <= currentStepIndex && !isCancelled) ||
                                                (isCancelled && step.id === "pending")
                                                ? "border-[#FE722D] text-[#FE722D]"
                                                : "border-gray-200 text-gray-300"
                                        }
                    ${isActive ? "scale-110" : ""}
                  `}
                                >
                                    {isCompleted && !isCancelled ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                            </div>

                            <div className="absolute top-14 flex flex-col items-center w-32">
                                <span
                                    className={`text-[10px] md:text-xs font-medium text-center
                    ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}
                    ${isCancelled && step.id === "cancelled" ? "text-[#FE722D]" : ""}
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
