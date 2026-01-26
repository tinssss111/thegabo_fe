/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";
import { pendingOrderStorage } from "@/lib/pendingOrderStorage";
import { CheckCircle, XCircle, ChevronLeft, ShoppingBag, ReceiptText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import confetti from "canvas-confetti";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      verifyPayment();
    }
  }, [isAuthenticated, orderId]);

  const verifyPayment = async () => {
    try {
      setIsVerifying(true);
      const response = await paymentService.getPaymentStatus(orderId);

      if (response.success && response.data) {
        setPaymentInfo(response.data);
        if (response.data.paymentInfo.status === "PAID") {
          pendingOrderStorage.clearPendingOrder();
          triggerConfetti();
        }
      } else {
        setError("Không thể xác minh trạng thái thanh toán");
      }
    } catch (error: any) {
      console.error("Verify payment error:", error);
      setError("Đã có lỗi xảy ra khi xác minh thanh toán");
    } finally {
      setIsVerifying(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FE722D", "#D6E5BE", "#FFFFFF"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FE722D", "#D6E5BE", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white md:bg-gray-50 mt-10">
      <Header />

      <main className="flex-1 flex flex-col items-center py-8 md:py-16 px-4">
        <div className="max-w-xl w-full">
          {/* Header Title đồng bộ trang Cart */}
          <div className="mb-8 flex items-center gap-2 px-1">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-7 h-7 text-black" />
            </button>
            <h2 className="text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Xác nhận
            </h2>
          </div>

          {isVerifying ? (
            <LoadingOverlay message="Đang xác nhận giao dịch..." />
          ) : error ? (
            <div className="bg-white border-t border-b md:border md:rounded-lg border-gray-200 p-10 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tighter">
                Xác minh thất bại
              </h2>
              <p className="text-gray-500 text-sm mb-8">{error}</p>
              <button
                onClick={() => router.push("/orders")}
                className="w-full py-4 bg-[#2D312E] text-white font-bold uppercase tracking-tighter hover:bg-black transition-colors"
              >
                Kiểm tra danh sách đơn hàng
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Thành công Card */}
              <div className="bg-white overflow-hidden">
                <div className="p-10 text-center">
                  <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tighter">
                    Thanh toán hoàn tất
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Cảm ơn bạn đã lựa chọn THE GABO. Đơn hàng của bạn đã được xác nhận và đang chờ xử lý.
                  </p>
                </div>

                {/* Chi tiết đơn hàng style tối giản */}
                {paymentInfo && (
                  <div className="border-t border-gray-100 bg-gray-50/30 px-8 py-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Mã đơn hàng</span>
                      <span className="font-bold text-gray-900">#{paymentInfo.order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                      <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Tổng thanh toán</span>
                      <span className="font-bold text-gray-900 text-lg">{paymentInfo.order.total.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                      <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Trạng thái</span>
                      <span className="text-green-600 font-bold uppercase tracking-tighter text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Đã thanh toán
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút hành động style THE GABO */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push(`/orders/${orderId}`)}
                  className="w-full py-4 bg-[#FE722D] text-white font-medium text-lg hover:bg-[#e05d1b] transition-colors uppercase tracking-tighter flex items-center justify-center gap-2"
                >
                  <ReceiptText className="w-5 h-5" />
                  Theo dõi đơn hàng
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full py-4 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors uppercase tracking-tighter text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Tiếp tục mua sắm
                </button>
              </div>

              {/* Thông tin vận chuyển tinh gọn */}
              <div className="bg-gray-100 p-5">
                <h4 className="text-xl font-medium text-black mb-3">Thông tin dự kiến</h4>
                <ul className="text-md text-black space-y-2">
                  <li className="flex font-medium items-start gap-2">• Nhà hàng đang chuẩn bị món ăn cho bạn</li>
                  <li className="flex font-medium items-start gap-2">• Thời gian giao hàng dự kiến: 30 - 45 phút</li>
                  <li className="flex font-medium items-start gap-2">• Nhân viên sẽ gọi điện khi món ăn gần đến nơi</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}