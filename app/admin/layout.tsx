/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader";
import Link from "next/link";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 5l3-3m0 0l3 3m-3-3v12"
        />
      </svg>
    ),
  },
  {
    name: "Quản lý đơn hàng",
    href: "/admin/orders",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  // {
  //   name: "Quản lý menu",
  //   href: "/admin/menu",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  //     </svg>
  //   ),
  // },
  // {
  //   name: "Quản lý nhà hàng",
  //   href: "/admin/restaurants",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
  //     </svg>
  //   ),
  // },
  {
    name: "Quản lý người dùng",
    href: "/admin/users",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292m0-5.292a4 4 0 100 5.292m0-5.292A4 4 0 005.364 9M9 9h6m-6 0a9 9 0 1118 0 9 9 0 01-18 0z"
        />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    // Check if user is admin
    if (!isLoading && (!user || user.role !== 1)) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F0F2ED]">
        <Loader size={40} />
      </div>
    );
  }

  if (!user || user.role !== 1) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="font-medium">
      {/* Container wrapper just like the image's inner browser window feel bg-[#FAFBF9] */}
      <div className="w-full max-w-360 h-[90vh] min-h-206.75 overflow-hidden flex relative">
        {/* Fixed Sidebar */}
        <aside className="w-65 h-full bg-[#F2F3EE] border-r-2 border-gray-200 flex flex-col shrink-0">
          <div className="items-center justify-center py-6 flex gap-2">
            <img
              src="/images/logo.png"
              alt="THE GABO"
              className="w-10 h-10 lg:w-30 lg:h-30"
            />
          </div>

          <div className="px-6 mb-8">
            <div className="flex items-center justify-between border border-gray-100 bg-white px-3 py-2.5 rounded-xl shadow-sm cursor-pointer hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    My Workspace
                  </p>
                  <p className="text-[11px] text-gray-500">Free plan</p>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
                    isActive
                      ? "bg-[#113A28] text-white"
                      : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area flex flex-col */}
        <div className="flex-1 flex flex-col h-full bg-[#F2F3EE] overflow-hidden">
          {/* Header */}
          <header className="h-22 flex shrink-0 items-center justify-between px-10 border-b-2 border-gray-200">
            <h2 className="text-3xl text-gray-900 tracking-tight">
              Admin Dashboard
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm transition-colors relative">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <div className="absolute w-2 h-2 bg-red-500 rounded-full top-2.5 right-2.5 border-2 border-white"></div>
                </button>
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {user?.fullName}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="p-1 bg-green-500 rounded-full"></div>{" "}
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto px-10 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
