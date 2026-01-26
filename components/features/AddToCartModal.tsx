"use client";

import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Food } from "@/types/food";
import { Addon } from "@/types/addon";
import AddonSelector from "./AddonSelector";
import Image from "next/image";
import Loader from "../ui/Loader";

interface AddToCartModalProps {
  isOpen: boolean;
  food: Food;
  onClose: () => void;
  onAddToCart: (quantity: number, addons: Addon[]) => void;
  isLoading?: boolean;
}

export default function AddToCartModal({
  isOpen,
  food,
  onClose,
  onAddToCart,
  isLoading = false,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  if (!isOpen) return null;

  const basePrice = food.price * quantity;
  const addonsPrice = selectedAddons.reduce(
    (sum, addon) => sum + addon.price,
    0,
  );
  const totalPrice = basePrice + addonsPrice;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(20, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedAddons);
    // Reset state
    setQuantity(1);
    setSelectedAddons([]);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-slide-up sm:animate-scale-in">
        {/* Header with Close Button */}
        <div className="relative bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-medium text-gray-900">Thêm món vào giỏ hàng</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Product Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {food.name}
                </h3>
                <p className="text-xs text-gray-500 mb-1">
                  {food.soldCount}+ đã bán
                </p>
                <p className="text-base font-bold text-[#FE722D]">
                  {food.price.toLocaleString()}đ
                </p>
              </div>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded border border-[#98A999] flex items-center justify-center text-[#98A999] hover:bg-[#98A999]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-medium text-gray-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 20}
                    className="w-8 h-8 rounded border border-[#FE722D] bg-[#FE722D] flex items-center justify-center text-white hover:bg-[#FF6B6B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Addon Selector */}
          <div className="p-4">
            <AddonSelector
              foodId={food._id}
              selectedAddons={selectedAddons}
              onAddonsChange={setSelectedAddons}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-[#FE722D] hover:bg-[#E65C1A] text-white font-medium py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={20} />
                <span>Đang thêm...</span>
              </>
            ) : (
              <span>Thêm vào giỏ hàng - {totalPrice.toLocaleString()}đ</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
