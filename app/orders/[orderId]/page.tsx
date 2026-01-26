/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { restaurantService } from "@/services/restaurantService";
import { Order } from "@/types/order";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import Loader from "@/components/ui/Loader";
import {
  MapPin,
  Phone,
  CreditCard,
  FileText,
  Truck,
  ChevronLeft,
} from "lucide-react";
import ProcessSteps from "@/components/ui/ProcessSteps";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      loadOrder();
    }
  }, [isAuthenticated, orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
        if (response.data.restaurant?._id) {
          loadRestaurant(response.data.restaurant._id);
        }
      }
    } catch (error: any) {
      console.error("Load order error:", error);
      setToast({
        message:
          error.response?.data?.error?.message || "Không tìm thấy đơn hàng",
        type: "error",
      });
      setTimeout(() => router.push("/orders"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRestaurant = async (restaurantId: string) => {
    try {
      const response = await restaurantService.getRestaurantById(restaurantId);
      setRestaurant(response);
    } catch (error) {
      console.error("Load restaurant error:", error);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader size={60} />
          <p className="text-gray-600 font-medium text-lg">
            Đang tải thông tin đơn hàng...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12 px-4 mt-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="w-full max-w-xl mb-4 flex items-center gap-2 sticky top-20 md:top-20 bg-gray-50/80 backdrop-blur z-10 px-1 py-2">
            <button
              onClick={() => router.push("/profile")}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-7 h-7 text-black" />
            </button>
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Chi tiết đơn hàng
            </h2>
          </div>

          <div className="space-y-8">
            {/* SECTION 1: Process Status */}
            <div className="bg-white border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Trạng thái đơn hàng
                </h3>
                <span className="text-gray-500 font-medium">
                  #{order.orderNumber}
                </span>
              </div>
              <ProcessSteps status={order.orderStatus} />
              {/* Simple Stepper/Status Display */}
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center w-full">
                  <div className={` shrink-0 bg-opacity-20`}>
                    {order.orderStatus === "pending"}
                    {order.orderStatus === "shipping"}
                    {["delivered", "confirmed", "preparing"].includes(
                      order.orderStatus,
                    )}
                    {["cancelled", "failed"].includes(order.orderStatus)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-xl text-gray-900">
                      {orderService.formatOrderStatus(order.orderStatus)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                {order.estimatedDeliveryTime && (
                  <div className="md:text-right shrink-0">
                    <p className="text-sm text-gray-500">Dự kiến giao hàng</p>
                    <p className="text-lg font-medium text-blue-600">
                      {new Date(order.estimatedDeliveryTime).toLocaleString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: Delivery Route (From -> To) */}
            <div className="bg-white  border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">
                  Hành trình đơn hàng
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 relative">
                {/* FROM: Restaurant */}
                <div className="p-6 bg-white relative group">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Từ địa chỉ (Nhà hàng)
                  </p>

                  {restaurant ? (
                    <div className="flex items-start gap-4 z-10 relative">
                      <div>
                        <h4 className="font-medium text-gray-900 text-lg">
                          {restaurant.name}
                        </h4>
                        <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">
                            {restaurant.addresses ||
                              restaurant.address ||
                              "Chi nhánh chính"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="w-4 h-4" />
                          <span>
                            {restaurant.phoneNumber || restaurant.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 text-lg">
                          {order.restaurant.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.restaurant.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow Indicator (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md text-[#FE722D]">
                  <div className="animate-pulse">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>

                {/* TO: User Address */}
                <div className="p-6 bg-white relative border-l border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Đến địa chỉ (Người nhận)
                  </p>
                  <div className="flex items-start gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 text-lg">
                        {order.user?.name || user?.fullName || "Khách hàng"}
                      </h4>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                          {order.deliveryAddress || user?.addresses}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="w-4 h-4" />
                        <span>
                          {order.user?.phone || user?.phoneNumber || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.shipper && (
                <div className="bg-green-50 p-4 border-t border-green-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Truck className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-900">
                        Shipper đang giao hàng
                      </p>
                      <p className="text-xs text-green-700">
                        {order.shipper.name} • {order.shipper.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${order.shipper.phone}`}
                    className="p-2 bg-white rounded-full shadow-sm text-green-700 hover:bg-green-50"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* SECTION 3: Order Summary */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FE722D]" />
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900 text-base">
                          {item.food.name}
                        </p>
                        <p className="font-medium text-gray-900">
                          {(
                            item.price * item.quantity +
                            (item.selectedOptions?.reduce(
                              (sum, opt) => sum + opt.price,
                              0,
                            ) || 0) *
                              item.quantity
                          ).toLocaleString()}
                          đ
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-500">
                          Số lượng:{" "}
                          <span className="font-medium text-gray-900">
                            {item.quantity}
                          </span>
                        </p>
                        {item.selectedOptions &&
                          item.selectedOptions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.selectedOptions.map((opt, i) => (
                                <span
                                  key={i}
                                  className="text-xs text-[#FE722D] font-medium"
                                >
                                  + {opt.addonName}({opt.price.toLocaleString()}
                                  đ)
                                </span>
                              ))}
                            </div>
                          )}
                        {item.note && (
                          <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit mt-1">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Order Info & Actions */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FE722D]" />
                Thanh toán
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                {order.note && (
                  <div className="mt-4 bg-gray-50 p-4">
                    <p className="text-md font-medium text-gray-600 mb-1">
                      Ghi chú đơn hàng
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {order.note}
                    </p>
                  </div>
                )}
                {/* Left: Financials */}
                <div className="space-y-4">
                  <div className="flex justify-between text-md">
                    <span className="text-gray-600 font-medium">Tạm tính</span>
                    <span className="font-medium">
                      {order.subtotal.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-md">
                    <span className="text-gray-600 font-medium">
                      Phí giao hàng
                    </span>
                    <span className="font-medium">
                      {order.deliveryFee.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg text-gray-900">
                      Tổng thanh toán
                    </span>
                    <span className="text-2xl font-bold text-[#FE722D]">
                      {order.total.toLocaleString()}đ
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="">
                      <CreditCard className="w-5 h-5 text-[#FE722D]" />
                    </div>
                    <div>
                      <p className="font-medium uppercase text-sm">
                        {order.paymentMethod}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`rounded-sm text-md font-bold uppercase ${
                          order.paymentStatus === "paid"
                            ? "text-green-700"
                            : order.paymentStatus === "pending"
                              ? "text-yellow-700"
                              : "text-red-700"
                        }`}
                      >
                        {orderService.formatPaymentStatus(order.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
