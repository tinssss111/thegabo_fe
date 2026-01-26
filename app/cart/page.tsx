/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { cartService } from "@/services/cartService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Loader from "@/components/ui/Loader";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft } from "lucide-react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading, updateCartItem, deleteCartItem } = useCart();
  const [, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
  }>({ isOpen: false, itemId: null });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      setSelectedItems(new Set(cart.items.map((item) => item._id)));
    }
  }, [cart?.items.length]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 20) return;
    try {
      const item = cart?.items.find((i) => i._id === itemId);
      const addonIds = item?.selectedOptions?.map((opt) => opt._id) || [];

      await updateCartItem(itemId, {
        quantity: newQuantity,
        addons: addonIds,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setDeleteModal({ isOpen: true, itemId });
  };

  const confirmDelete = async () => {
    if (deleteModal.itemId) {
      try {
        await deleteCartItem(deleteModal.itemId);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
    setDeleteModal({ isOpen: false, itemId: null });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="text-center pt-4">
          <h1 className="text-4xl font-bold">THE GABO</h1>
        </div>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <LoadingOverlay message="Đang tải giỏ hàng..." size={50} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="text-center pt-4">
          <h1 className="text-4xl font-bold">THE GABO</h1>
        </div>
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center px-4">
            <ShoppingBag className="w-20 h-20 mx-auto text-[#FE722D] mb-4" />
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Giỏ hàng của bạn trống
            </h2>
            <p className="text-gray-500 mb-6">
              Thêm một số món ăn ngon miệng để bắt đầu!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#FE722D] text-white hover:bg-[#E65C1A] transition-colors"
            >
              Quay lại Menu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + cartService.calculateItemTotal(item),
    0
  );

  return (
    <div className="min-h-screen flex flex-col mt-10">
      <Header />

      <main className="flex-1 bg-gray-50 py-6 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header ngoài box */}
          <div className="w-full max-w-xl mb-4 flex items-center gap-2 sticky top-[80px] md:top-20 bg-gray-50/80 backdrop-blur z-10 px-1 py-2">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-7 h-7 text-black" />
            </button>
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Giỏ hàng
            </h2>
          </div>

          {/* Table Header - Ẩn trên mobile */}
          <div className="hidden md:block bg-white border-t border-b border-gray-300">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-600">
              <div className="col-span-5">Thông tin sản phẩm</div>
              <div className="col-span-2 text-center">Giá bán</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-lg md:rounded-none overflow-hidden">
            {cart.items.map((item, index) => {
              const itemPrice = item.food.price;
              const itemTotal = cartService.calculateItemTotal(item);

              return (
                <div
                  key={item._id}
                  className={`flex flex-col md:grid md:grid-cols-12 gap-4 px-4 py-4 md:px-6 md:py-6 items-center ${index !== cart.items.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                >
                  {/* Product Info & Price (Mobile Layout) */}
                  <div className="w-full md:col-span-5 flex items-start md:items-center gap-4">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm md:text-base font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.food.name}
                        </h3>
                        {/* Nút xóa trên mobile */}
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="md:hidden text-gray-400 p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="text-[10px] md:text-xs text-gray-500 space-y-0.5">
                          {item.selectedOptions.map((addon, idx) => (
                            <div key={addon._id || idx}>
                              + {addon.addonName} (+{addon.price.toLocaleString()}đ)
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Giá đơn vị hiển thị trên mobile */}
                      <p className="md:hidden text-sm font-semibold text-gray-600 mt-1">
                        {itemPrice.toLocaleString()}đ
                      </p>
                    </div>
                  </div>

                  {/* Sales Amount - Chỉ hiện desktop */}
                  <div className="hidden md:block md:col-span-2 text-center">
                    <p className="text-base font-semibold text-gray-900">
                      {itemPrice.toLocaleString()}đ
                    </p>
                  </div>

                  {/* Quantity & Actions (Mobile Row) */}
                  <div className="w-full md:col-span-2 flex items-center justify-between md:justify-center mt-2 md:mt-0">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 md:px-4 py-1 md:py-2 font-medium min-w-[40px] md:min-w-12 text-center text-sm md:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={item.quantity >= 20}
                        className="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thành tiền hiển thị bên phải trên mobile */}
                    <div className="md:hidden text-right">
                      <p className="text-base font-bold text-gray-900">
                        {itemTotal.toLocaleString()}đ
                      </p>
                    </div>
                  </div>

                  {/* Purchase Amount - Desktop */}
                  <div className="hidden md:block md:col-span-2 text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {itemTotal.toLocaleString()}đ
                    </p>
                  </div>

                  {/* Delete - Desktop */}
                  <div className="hidden md:flex md:col-span-1 justify-center">
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white border-t-2 border-gray-300 mt-8 py-6 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 md:gap-8 text-sm md:text-lg mb-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Tổng sản phẩm</p>
                  <p className="text-lg md:text-xl font-bold">
                    {totalAmount.toLocaleString()}đ
                  </p>
                </div>
                <div className="text-2xl text-gray-400">-</div>
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Giảm giá</p>
                  <p className="text-lg md:text-xl font-bold">0đ</p>
                </div>
              </div>

              <div className="text-center mb-6 border-t border-dashed border-gray-200 pt-4">
                <p className="text-gray-600 mb-1">Tổng thanh toán</p>
                <p className="text-2xl md:text-3xl font-bold text-[#FE722D]">
                  {totalAmount.toLocaleString()}đ
                </p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full max-w-md mx-auto block py-3 md:py-4 bg-[#FE722D] text-white font-medium text-base md:text-lg rounded-lg md:rounded-none hover:bg-[#e05d1b] transition-colors"
              >
                Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Bạn có muốn xóa sản phẩm?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, itemId: null })}
      />
    </div>
  );
}