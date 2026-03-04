/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { cartService } from "@/services/cartService";
import { pendingOrderStorage } from "@/lib/pendingOrderStorage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import Loader from "@/components/ui/Loader";
import {
  MapPin,
  FileText,
  ChevronLeft,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import dynamic from "next/dynamic";

const AddressMapModal = dynamic(
  () => import("@/components/ui/AddressMapModal"),
  { ssr: false },
);

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerCoordinates, setCustomerCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [calculatedFee, setCalculatedFee] = useState<number>(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [hasFeeError, setHasFeeError] = useState(false);
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
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
    if (user) {
      if (typeof user.addresses === "string") {
        setDeliveryAddress(user.addresses);
      } else if (user.addresses && user.addresses.text) {
        setDeliveryAddress(user.addresses.text);
      }

      let lat = user.latitude;
      let lng = user.longitude;
      if (!lat && user.addresses && user.addresses.latitude) {
        lat = user.addresses.latitude;
        lng = user.addresses.longitude;
      }

      if (lat && lng) {
        setCustomerCoordinates({ lat, lng });
        if (
          !deliveryAddress ||
          deliveryAddress.includes("Vị trí:") ||
          deliveryAddress.includes("Tọa độ:")
        ) {
          setDeliveryAddress("Đang tải địa chỉ...");
          fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.features && data.features.length > 0) {
                const props = data.features[0].properties;
                const nameParts = [
                  props.name,
                  props.street,
                  props.district,
                  props.city,
                  props.state,
                ].filter(Boolean);
                const formatted = Array.from(new Set(nameParts)).join(", ");
                setDeliveryAddress(
                  formatted || `Vị trí: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                );
              } else {
                setDeliveryAddress(
                  `Vị trí: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                );
              }
            })
            .catch(() =>
              setDeliveryAddress(
                `Vị trí: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
              ),
            );
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (customerCoordinates && cart?.restaurant?._id) {
      const fetchFee = async () => {
        setIsCalculatingFee(true);
        try {
          const result = await orderService.calculateFee({
            restaurantId: cart.restaurant._id,
            customerCoordinates,
          });
          setCalculatedFee(result.data?.fee || result.fee || 0); // handle variations of response structure
          setDistance(result.data?.distance || result.distance || null);
          setHasFeeError(false);
        } catch (error: any) {
          console.error("Fee calculation error:", error);
          setCalculatedFee(0);
          setDistance(null);
          setHasFeeError(true);

          let errorMessage =
            "Không thể tính phí giao hàng. Vui lòng kiểm tra lại địa chỉ.";

          // Check if error message indicates service area issue
          if (
            error.response?.data?.message?.includes("out of service area") ||
            error.response?.data?.message?.includes("ngoài phạm vi") ||
            error.response?.status === 400
          ) {
            errorMessage =
              "Địa chỉ này nằm ngoài phạm vi giao hàng của chúng tôi. Vui lòng chọn địa chỉ khác.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          setToast({
            message: errorMessage,
            type: "error",
          });
        } finally {
          setIsCalculatingFee(false);
        }
      };

      const timerId = setTimeout(() => {
        fetchFee();
      }, 500);
      return () => clearTimeout(timerId);
    }
  }, [customerCoordinates, cart?.restaurant?._id]);

  if (authLoading || !isAuthenticated) return null;

  if (cartLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader size={60} />
          <p className="text-gray-600 text-lg">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">
              Vui lòng thêm món vào giỏ hàng trước khi thanh toán
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#FE722D] text-white hover:bg-[#e05d1b] transition shadow-lg shadow-orange-200"
            >
              Quay lại trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + cartService.calculateItemTotal(item),
    0,
  );

  const deliveryFee = calculatedFee;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!deliveryAddress || deliveryAddress.length < 5) {
      setToast({
        message:
          "Vui lòng nhập địa chỉ giao hàng. Bạn có thể sử dụng bản đồ để chọn chính xác tọa độ.",
        type: "error",
      });
      return;
    }

    if (!customerCoordinates) {
      setToast({
        message: "Vui lòng chọn vị trí giao hàng trên bản đồ.",
        type: "error",
      });
      return;
    }

    if (note.length > 500) {
      setToast({
        message: "Ghi chú không được quá 500 ký tự",
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const orderResponse = await orderService.createOrder({
        deliveryAddress,
        note: note || undefined,
        customerCoordinates,
      });

      if (!orderResponse.success || !orderResponse.data)
        throw new Error(
          orderResponse.error?.message || "Không thể tạo đơn hàng",
        );

      const {
        _id: orderId,
        orderNumber,
        total: orderTotal,
      } = orderResponse.data;

      const paymentResponse = await paymentService.createPaymentLink({
        orderId,
      });

      if (!paymentResponse.success || !paymentResponse.data)
        throw new Error(
          paymentResponse.error?.message || "Không thể tạo link thanh toán",
        );

      pendingOrderStorage.savePendingOrder({
        orderId,
        orderNumber,
        total: orderTotal,
        timestamp: Date.now(),
      });

      window.location.href = paymentResponse.data.checkoutUrl;
    } catch (error: any) {
      let errorMessage = error.message || "Đã có lỗi xảy ra";

      // Check if restaurant is closed (400 status)
      if (error.response?.status === 400) {
        const backendMessage = error.response?.data?.message || "";
        if (
          backendMessage.includes("closed") ||
          backendMessage.includes("đóng") ||
          backendMessage.includes("đóng cửa") ||
          backendMessage.includes("không hoạt động")
        ) {
          errorMessage = "Nhà hàng đã đóng cửa. Vui lòng chọn nhà hàng khác.";
        } else {
          errorMessage =
            backendMessage ||
            "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        }
      }

      setToast({
        message: errorMessage,
        type: "error",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />

      <main className="flex-1 py-12 px-4 mt-16 flex flex-col items-center">
        {/* Header ngoài box */}
        <div className="w-full max-w-xl mb-4 flex items-center gap-2 sticky top-20 bg-gray-50/80 backdrop-blur z-10 px-1 py-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-7 h-7 text-black" />
          </button>
          <h2 className="text-2xl font-medium text-gray-900 tracking-tighter uppercase">
            Thanh toán
          </h2>
        </div>

        {/* Box nội dung */}
        <div className="w-full max-w-xl bg-white border border-gray-100 shadow-sm rounded-none overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Đơn hàng */}
            <section>
              <h3 className="text-xl font-medium text-gray-900 mb-5">
                Đơn hàng của bạn
              </h3>

              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.food.image}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{item.food.name}</p>

                      {item.selectedOptions?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedOptions.map((opt, i) => (
                            <span
                              key={i}
                              className="text-sm text-[#FE722D] font-medium"
                            >
                              + {opt.addonName}({opt.price.toLocaleString()}đ)
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-400 font-medium mt-2">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {cartService.calculateItemTotal(item).toLocaleString()}đ
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>
                    Phí giao hàng{" "}
                    {distance !== null && `(${distance.toFixed(1)} km)`}
                  </span>
                  <span>
                    {isCalculatingFee
                      ? "Đang tính..."
                      : deliveryFee === 0 && customerCoordinates
                        ? "Miễn phí"
                        : !customerCoordinates
                          ? "Chọn địa chỉ"
                          : `${deliveryFee.toLocaleString()}đ`}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-xl font-bold">Tổng cộng</span>
                  <span className="text-3xl font-bold text-[#FE722D]">
                    {total.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-400 mb-1 border-t border-dashed pt-6">
                Địa chỉ giao hàng (Hiển thị trên bản đồ)
              </h3>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-4 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent text-left bg-white text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  {deliveryAddress ? (
                    <span className="truncate flex-1">{deliveryAddress}</span>
                  ) : (
                    <span className="text-gray-500 flex-1">
                      Chọn vị trí bản đồ...
                    </span>
                  )}
                  <MapPin className="w-5 h-5 text-[#FE722D] shrink-0 ml-2" />
                </button>

                {customerCoordinates && (
                  <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                    Báo cáo tọa độ: ({customerCoordinates.lat.toFixed(6)},{" "}
                    {customerCoordinates.lng.toFixed(6)})
                    {isCalculatingFee && <Loader size={12} />}
                  </div>
                )}
              </div>
            </section>

            {/* Ghi chú */}
            <section>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Ghi chú
              </h3>
              <div className="relative">
                <FileText className="absolute top-4 left-4 w-5 h-5 text-gray-300" />
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full pl-12 py-4 bg-gray-50 outline-none"
                  placeholder="Lời nhắn..."
                />
              </div>
            </section>

            {/* Thanh toán */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing || !deliveryAddress || hasFeeError}
              className="w-full py-5 bg-[#FE722D] text-white font-medium hover:bg-[#e05d1b] transition-colors uppercase flex justify-center gap-2 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader size={20} color="white" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Xác nhận thanh toán
                </>
              )}
            </button>

            <div className="flex justify-center text-md font-medium text-gray-300 uppercase gap-2">
              <ShieldCheck className="w-6 h-6 text-green-500/50" />
              Thanh toán an toàn qua PayOS
            </div>
          </div>
        </div>
      </main>

      <AddressMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialPosition={customerCoordinates}
        onConfirm={(loc) => {
          setDeliveryAddress(
            loc.displayName || `Lat: ${loc.lat}, Lng: ${loc.lng}`,
          );
          setCustomerCoordinates({ lat: loc.lat, lng: loc.lng });
        }}
      />

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
