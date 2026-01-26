"use client";

import Link from "next/link";
import { Facebook, Instagram, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const menuLinks = [
    { label: "Cơm văn phòng", href: "/menu/office-rice" },
    { label: "Cơm gà", href: "/menu/chicken-rice" },
    { label: "Cơm sườn", href: "/menu/pork-rice" },
    { label: "Món chay", href: "/menu/vegetarian" },
  ];

  const supportLinks = [
    { label: "Cách đặt cơm", href: "/how-to-order" },
    { label: "Giao hàng", href: "/delivery" },
    { label: "Câu hỏi thường gặp", href: "/faq" },
  ];

  const companyLinks = [
    { label: "Về THE GABO", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
    { label: "Chính sách & điều khoản", href: "/policy" },
  ];

  const footerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact-section"
      className="w-full bg-gray-100 text-[#1f2937] mt-auto overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* TOP GRID */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 transition-all duration-800 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
          `}
        >
          {/* Brand */}
          <div className="transition-all duration-700 delay-100">
            <h3 className="text-sm mb-4">THE GABO – Cơm ngon mỗi ngày</h3>
            <p className="text-sm text-[#4b5563] mb-4">
              Đăng ký để nhận menu mới & ưu đãi mỗi ngày
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 bg-gray-200 border border-white/40 rounded text-sm focus:outline-none focus:border-[#D6E5BE]"
              />
              <a href="/register">
                <button className="px-4 py-2 bg-[#FE722D] text-white text-sm rounded hover:bg-[#E65C1A] transition-colors">
                  Đăng ký
                </button>
              </a>
            </div>

            <div className="flex gap-3">
              {[Facebook, Instagram, Phone].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white/60 transition"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div className="transition-all duration-700 delay-200">
            <h4 className="text-sm mb-4">Thực đơn</h4>
            <ul className="space-y-2">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4b5563] hover:text-[#1f2937]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="transition-all duration-700 delay-300">
            <h4 className="text-sm mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4b5563] hover:text-[#1f2937]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="transition-all duration-700 delay-400">
            <h4 className="text-sm mb-4">THE GABO</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4b5563] hover:text-[#1f2937]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BIG LOGO */}
        <div
          className={`border-t border-white/40 pt-8 transition-all duration-900 delay-500 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
          `}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            THE GABO
          </h1>
          <p className="text-sm text-[#4b5563] mt-2">
            Cơm nhà nấu – Giao tận nơi – Ăn là ghiền
          </p>
        </div>
      </div>
    </footer>
  );
}
