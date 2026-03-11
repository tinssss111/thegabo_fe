"use client";

import { useEffect, useState } from "react";
import { Addon } from "@/types/addon";
import { addonService, addonHelpers } from "@/services/addonService";
import Loader from "@/components/ui/Loader";
import { Check } from "lucide-react";

interface AddonSelectorProps {
  foodId: string;
  selectedAddons: Addon[];
  onAddonsChange: (addons: Addon[]) => void;
}

export default function AddonSelector({
  foodId,
  selectedAddons,
  onAddonsChange,
}: AddonSelectorProps) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        setLoading(true);
        const availableAddons =
          await addonService.getAvailableAddonsByFood(foodId);
        console.log("Fetched addons:", availableAddons);
        setAddons(availableAddons);
      } catch (error) {
        console.error("Failed to fetch addons:", error);
        setAddons([]);
      } finally {
        setLoading(false);
      }
    };

    if (foodId) {
      fetchAddons();
    }
  }, [foodId]);

  const handleAddonToggle = (addon: Addon) => {
    const isSelected = selectedAddons.find((a) => a._id === addon._id);
    if (isSelected) {
      onAddonsChange(selectedAddons.filter((a) => a._id !== addon._id));
    } else {
      onAddonsChange([...selectedAddons, addon]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <Loader size={40} />
        <p className="text-gray-500 text-sm">Đang tải tùy chọn...</p>
      </div>
    );
  }

  if (addons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1 sm:space-y-2">
      {addons.map((addon) => {
        const isSelected = selectedAddons.find((a) => a._id === addon._id);
        const isSelectable = addonHelpers.isAddonSelectable(addon);

        return (
          <button
            key={addon._id}
            onClick={() => isSelectable && handleAddonToggle(addon)}
            disabled={!isSelectable}
            className={`w-full flex items-center justify-between p-2 sm:p-3 transition-colors text-sm sm:text-base ${
              !isSelectable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-left flex-1">
                <p className="font-medium text-gray-900 text-xs sm:text-sm">
                  {addon.addonName}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-gray-900">
                  {addon.price.toLocaleString()}đ
                </span>
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#a60207] border-[#a60207]"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
