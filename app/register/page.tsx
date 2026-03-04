/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const AddressMapModal = dynamic(() => import("@/components/ui/AddressMapModal"), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    addresses: "",
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.latitude || !formData.longitude) {
      setError("Vui lòng chọn địa chỉ giao dịch trên bản đồ để lưu tọa độ.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        addresses: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        latitude: formData.latitude,
        longitude: formData.longitude,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Link href="/">
          <div className="flex items-center justify-center">
            <img
              src="/images/thegabo.png"
              alt=""
              className="w-16 h-16 lg:w-13 lg:h-13 mr-3"
            />
            <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">
              THE GABO
            </h1>
          </div>
          <h2 className="text-center text-md font-medium text-gray-700 mt-5">
            Tạo tài khoản mới
          </h2>
        </Link>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ và tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent"
                placeholder="Tạo mật khẩu"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Địa chỉ (Hiển thị trên bản đồ)
              </label>

              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent text-left bg-white text-gray-700 hover:bg-gray-50 transition"
              >
                {formData.addresses ? (
                  <span className="truncate">{formData.addresses}</span>
                ) : (
                  <span className="text-gray-500">Chọn vị trí bản đồ...</span>
                )}
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
              </button>

              {formData.latitude !== 0 && (
                <p className="text-xs text-green-600 mt-1 font-medium">Báo cáo tọa độ: ({formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)})</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium text-gray-800 bg-[#FE722D] hover:bg-[#E65C1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Loader size={20} />}
            {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-bold text-[#FE722D] hover:text-gray-900"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
        <AddressMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          initialPosition={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : null}
          onConfirm={(loc) => {
            setFormData({ ...formData, addresses: loc.displayName || `Lat: ${loc.lat}, Lng: ${loc.lng}`, latitude: loc.lat, longitude: loc.lng });
          }}
        />
      </div>
    </div>
  );
}
