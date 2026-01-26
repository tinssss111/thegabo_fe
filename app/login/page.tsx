/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            Đăng nhập vào tài khoản của bạn
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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent"
                placeholder="Enter your email"
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-2 focus:ring-[#FE722D] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                Quên mật khẩu ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium text-gray-800 bg-[#FE722D] hover:bg-[#E65C1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Loader size={20} />}
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Bạn không có tài khoản ?{" "}
              <Link
                href="/register"
                className="font-bold text-[#FE722D] hover:text-gray-900"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
