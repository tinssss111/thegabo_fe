"use client";

import React, { useState, useEffect } from "react";
import { X, Search, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";

// Import Map component dynamically to avoid SSR issues
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface Location {
    lat: number;
    lng: number;
    displayName?: string;
}

interface AddressMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (location: Location) => void;
    initialPosition?: { lat: number; lng: number } | null;
}

export default function AddressMapModal({
    isOpen,
    onClose,
    onConfirm,
    initialPosition,
}: AddressMapModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(initialPosition || null);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setSearchQuery("");
            setSuggestions([]);
            if (!selectedLocation && !initialPosition) {
                // Default to Ho Chi Minh City if no initial position
                setSelectedLocation({ lat: 10.8231, lng: 106.6297 });
            } else if (initialPosition) {
                setSelectedLocation(initialPosition);
            }
        }
    }, [isOpen, initialPosition]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 2) {
                searchLocations(searchQuery);
            } else {
                setSuggestions([]);
            }
        }, 600);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const searchLocations = async (query: string) => {
        setIsSearching(true);
        try {
            // Using Photon API which is more forgiving for fuzzy address searches
            const resp = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(
                    query
                )}&limit=5&lat=10.8231&lon=106.6297`
            );
            const data = await resp.json();

            if (data.features) {
                const results = data.features.map((f: any) => {
                    const props = f.properties;
                    const coords = f.geometry.coordinates; // [lon, lat]

                    // Format a nice display name
                    const nameParts = [
                        props.name,
                        props.street,
                        props.district,
                        props.city,
                        props.state,
                    ].filter(Boolean);
                    const displayName = Array.from(new Set(nameParts)).join(", ");

                    return {
                        lat: coords[1],
                        lon: coords[0],
                        display_name: displayName || "Địa điểm không tên",
                    };
                });
                setSuggestions(results);
            }
        } catch (error) {
            console.error("Error searching location:", error);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSuggestion = (suggestion: any) => {
        const lat = parseFloat(suggestion.lat);
        const lng = parseFloat(suggestion.lon);
        setSelectedLocation({ lat, lng });
        setDisplayName(suggestion.display_name);
        setSearchQuery(suggestion.display_name);
        setSuggestions([]);
    };

    const handleConfirm = async () => {
        if (!selectedLocation) return;

        setIsConfirming(true);
        try {
            const resp = await fetch(`https://photon.komoot.io/reverse?lon=${selectedLocation.lng}&lat=${selectedLocation.lat}`);
            const data = await resp.json();
            let finalName = "";
            if (data.features && data.features.length > 0) {
                const props = data.features[0].properties;
                const nameParts = [props.name, props.street, props.district, props.city, props.state].filter(Boolean);
                finalName = Array.from(new Set(nameParts)).join(", ");
            }

            if (!finalName) {
                finalName = `Tọa độ: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`;
            }

            onConfirm({
                ...selectedLocation,
                displayName: finalName,
            });
            onClose();
        } catch (error) {
            onConfirm({
                ...selectedLocation,
                displayName: `Tọa độ: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`,
            });
            onClose();
        } finally {
            setIsConfirming(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Chọn tọa độ địa chỉ</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-4 flex-1 overflow-auto">
                    {/* Search bar */}
                    <div className="relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm địa chỉ (ví dụ: Chợ Bến Thành)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D] focus:border-transparent outline-none"
                            />
                            {isSearching && (
                                <div className="absolute right-3">
                                    <Loader size={18} />
                                </div>
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute z-60 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {suggestions.map((s, index) => (
                                    <button
                                        key={index}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start gap-2"
                                        onClick={() => handleSelectSuggestion(s)}
                                    >
                                        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700">
                                            {s.display_name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="text-sm tracking-tight text-gray-500 font-medium">
                        Bản đồ gợi ý (Kéo hoặc nhấp chuột để ghim tọa độ chính xác nhất)
                    </p>

                    <div className="h-[400px] w-full rounded-lg relative z-0">
                        <MapPicker
                            position={selectedLocation}
                            onPositionChange={(pos) => setSelectedLocation(pos)}
                        />
                    </div>

                    {selectedLocation && (
                        <div className="px-3 py-2 bg-orange-50 rounded-lg border border-orange-100 text-sm mt-auto font-medium text-orange-800">
                            Tọa độ đã chọn: vĩ độ {selectedLocation.lat.toFixed(6)}, kinh độ{" "}
                            {selectedLocation.lng.toFixed(6)}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className="px-6 py-2.5 rounded-lg bg-[#FE722D] font-medium text-white hover:bg-[#e05d1b] flex items-center justify-center min-w-[120px]"
                    >
                        {isConfirming ? <Loader size={20} /> : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    );
}
