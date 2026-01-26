/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AlertCircle, ChevronLeft, RefreshCw, List } from "lucide-react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function PaymentCancelPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      handlePaymentCancel();
    }
  }, [isAuthenticated, orderId]);

  const handlePaymentCancel = async () => {
    try {
      setIsProcessing(true);
      await paymentService.cancelPayment(orderId);
    } catch (error: any) {
      console.error("Cancel payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white md:bg-gray-50 mt-10">
      <Header />

      <main className="flex-1 flex flex-col items-center py-8 md:py-16 px-4">
        <div className="max-w-xl w-full">
          {/* Header Title giống trang Cart */}
          <div className="mb-8 flex items-center gap-2 px-1">
            <button
              onClick={() => router.push("/profile")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-7 h-7 text-black" />
            </button>
            <h2 className="text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Thanh toán
            </h2>
          </div>

          {isProcessing ? (
            <LoadingOverlay message="Đang cập nhật trạng thái đơn hàng..." size={50} />
          ) : (
            <div className="space-y-6">
              {/* Card thông báo chính */}
              <div className="bg-white border-t border-b md:border md:rounded-lg border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-[#FE722D] rounded-full flex items-center justify-center mb-6 border border-gray-100">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-medium text-[#FE722D] mb-2 uppercase tracking-tighter">
                    Giao dịch đã bị hủy
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                    Bạn đã dừng quá trình thanh toán. Đừng lo lắng, đơn hàng vẫn được lưu lại trong hệ thống của THE GABO.
                  </p>
                </div>

                {/* Thông tin đơn hàng - Style giống Table ở trang Cart */}
                <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Mã đơn hàng</span>
                    <span className="font-bold text-gray-900">
                      #{searchParams.get("orderCode") || orderId.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Trạng thái</span>
                    <span className="text-orange-600 font-bold uppercase tracking-tighter text-xs">
                      {searchParams.get("status") || "Đã hủy"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nhóm nút bấm - Style đồng bộ nút "Thanh toán ngay" */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(`/orders/${orderId}`)}
                    className="flex items-center justify-center gap-2 py-4 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors uppercase tracking-tighter text-sm"
                  >
                    <List className="w-4 h-4" />
                    Chi tiết
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="flex items-center justify-center gap-2 py-4 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors uppercase tracking-tighter text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Đơn hàng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}