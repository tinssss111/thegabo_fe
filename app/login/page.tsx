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
      // Wait a bit for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check user role and redirect accordingly
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("User from cookie:", currentUser.role);
      if (currentUser.role === 1) {
        router.push("/admin");
      } else {
        router.push("/");
      }
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
    <div className="min-h-screen flex items-center justify-center bg-[#551B13] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Link href="/">
          <div className="flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt=""
              className="w-20 h-20 lg:w-35 lg:h-35 mr-3"
            />
          </div>
          <h2 className="text-center text-md font-medium text-white mt-5">
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
                className="block text-sm font-medium text-white mb-1"
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
                className="block text-sm font-medium text-white mb-1"
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
                href="#"
                className="font-medium text-white hover:text-gray-300"
              >
                Quên mật khẩu ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium text-gray-800 bg-[#730003] hover:bg-[#a50006] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Loader size={20} />}
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-200">
              Bạn không có tài khoản ?{" "}
              <Link
                href="/register"
                className="font-bold text-[#FE722D] hover:text-gray-300"
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
