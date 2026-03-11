/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Food } from "@/types/food";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AddToCartModal from "@/components/features/AddToCartModal";
import { Addon } from "@/types/addon";

interface ProductCardProps {
  product: Food;
  onAddToCart?: (product: Food) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setShowAddToCartModal(true);
  };

  const handleConfirmAddToCart = async (quantity: number, addons: Addon[]) => {
    setIsAdding(true);
    try {
      await addToCart({
        foodId: product._id,
        quantity,
        addons: addons.map((addon) => addon._id),
      });

      setToast({ message: "Thêm vào giỏ hàng thành công", type: "success" });
      setShowAddToCartModal(false);
    } catch (error: any) {
      if (error.message === "DIFFERENT_RESTAURANT") {
        setShowAddToCartModal(false);
        setShowConfirm(true);
      } else {
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";
        setToast({
          message: `Thêm vào giỏ hàng thất bại: ${errorMessage}`,
          type: "error",
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirmClearCart = async () => {
    setShowConfirm(false);
    setIsAdding(true);
    try {
      await clearCart();
      setToast({
        message: "Cart cleared. Please add item again.",
        type: "success",
      });
      setShowAddToCartModal(true);
    } catch (err: any) {
      setToast({
        message: `Failed to clear cart: ${err.response?.data?.message || err.message}`,
        type: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Different Restaurant"
        onConfirm={handleConfirmClearCart}
        onCancel={() => setShowConfirm(false)}
      />

      <AddToCartModal
        isOpen={showAddToCartModal}
        food={product}
        onClose={() => setShowAddToCartModal(false)}
        onAddToCart={handleConfirmAddToCart}
        isLoading={isAdding}
      />

      <div className="bg-[#FBF2D7] rounded-2xl overflow-hidden transition-all duration-300 group">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hiddenp-6">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain group-hover:rotate-12 transition-transform duration-500 ease-in-out"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col p-3 sm:p-4 md:p-5 items-center gap-2 sm:gap-3">
          <h3 className="text-gray-900 font-medium text-base sm:text-lg md:text-xl lg:text-2xl line-clamp-1">
            {product.name}
          </h3>

          {/* Sold Count */}
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Đã bán {product.soldCount} phần
          </p>
          <div className="text-left">
            <p className="text-gray-900 font-bold text-sm sm:text-base md:text-lg">
              {product.price.toLocaleString()}Đ
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full h-8 sm:h-9 md:h-10 bg-[#7D1919] text-white hover:bg-[#8f1b1b] flex items-center justify-center transition-colors group/btn disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            aria-label="Add to cart"
          >
            <span className="transition-colors">Thêm</span>
          </button>
        </div>
      </div>
    </>
  );
}
