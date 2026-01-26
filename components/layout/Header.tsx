/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Menu", href: "#menu-section" },
    { label: "Liên hệ", href: "#contact-section" },
    { label: "Giới thiệu", href: "/about" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isHomePage && !isScrolled ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="relative h-16 flex items-center justify-between">
          {/* MOBILE MENU BUTTON (LEFT) */}
          <button
            className={`lg:hidden p-2 -ml-2 ${isHomePage && !isScrolled ? "text-white" : "text-gray-900"}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* LEFT - LOGO */}
          <div className="flex items-center gap-2 group cursor-pointer lg:ml-0 ml-2">
            <img
              src="/images/thegabo.png"
              alt="THE GABO"
              className="w-10 h-10 lg:w-13 lg:h-13 rounded-full object-cover transition-all duration-300 ease-out"
            />

            <Link
              href="/"
              className={`text-lg lg:text-xl font-bold tracking-wide transition-transform duration-300 ease-out
      group-hover:translate-x-1
      ${isHomePage && !isScrolled ? "text-white" : "text-gray-900"}
    `}
            >
              THE GABO
            </Link>
          </div>

          {/* CENTER - NAV (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-10 text-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-medium transition-colors
        after:content-[''] after:absolute after:left-1/2 after:-bottom-2
        after:w-0 after:h-0.5 after:bg-current after:rounded-full
        after:transition-all after:duration-300
        hover:after:left-0 hover:after:w-full
        ${
          isHomePage && !isScrolled
            ? "text-white hover:text-[#FE722D]"
            : "text-gray-700 hover:text-[#FE722D]"
        }
      `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT - AUTH + CART */}
          <div className="flex items-center gap-3 lg:gap-5 text-md">
            {isAuthenticated ? (
              <div
                className="relative"
                onClick={() => setShowAuthPopup(!showAuthPopup)}
              >
                <button className="flex items-center gap-2 focus:outline-none">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFFE95] flex items-center justify-center">
                      <span className="text-gray-800 font-semibold text-sm">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {showAuthPopup && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAuthPopup(false);
                      }}
                    />
                    <div className="absolute top-12 right-0 mt-2 w-64 bg-white overflow-hidden border border-gray-500 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FE722D] transition-colors"
                          onClick={() => setShowAuthPopup(false)}
                        >
                          Tài khoản & Đơn hàng
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FE722D] transition-colors"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href="/login"
                  className={`relative font-medium transition-colors hover:text-[#FE722D]
      ${isHomePage && !isScrolled ? "text-white" : "text-gray-700"}
    `}
                >
                  Đăng nhập
                </Link>

                <Link
                  href="/register"
                  className={`relative font-medium transition-colors hover:text-[#FE722D]
      ${isHomePage && !isScrolled ? "text-white" : "text-gray-700"}
    `}
                >
                  Đăng ký
                </Link>
              </div>
            )}

            <Link href="/cart" className="relative">
              <ShoppingCart
                className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors ${
                  isHomePage && !isScrolled ? "text-white" : "text-gray-900"
                }`}
              />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FE722D] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="absolute top-0 left-0 w-[80%] max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[#FE722D]">THE GABO</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 hover:text-[#FE722D] py-2 border-b border-gray-50"
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-[#FE722D] text-white font-medium hover:bg-orange-600"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
