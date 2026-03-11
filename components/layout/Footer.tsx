"use client";

import Link from "next/link";
import { Facebook, Instagram, Phone } from "lucide-react";

export default function Footer() {
  const menuLinks = [
    { label: "Về chúng tôi", href: "/about" },
    { label: "Thực đơn", href: "#menu-section" },
    { label: "Đặt món", href: "#order-section" },
    { label: "Ưu đãi", href: "#promo-section" },
  ];

  const supportLinks = [
    { label: "Liên hệ", href: "/contact" },
    { label: "Chính sách bảo mật", href: "#privacy-policy" },
    { label: "Điều khoản sử dụng", href: "#terms-of-service" },
    { label: "FAQs", href: "#faqs" },
  ];

  return (
    <footer className="w-full bg-[#551B13] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {/* LOGO */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 text-[#a57172]">
              The GaBo
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Mang hương vị bếp Việt chân thật vào từng ngày bận rộn của bạn.
            </p>
          </div>

          {/* KHÁM PHÁ */}
          <div>
            <h4 className="text-[#a57172] font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
              Khám Phá
            </h4>

            <ul className="space-y-1 sm:space-y-2">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 text-xs sm:text-sm hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HỖ TRỢ */}
          <div>
            <h4 className="text-[#a57172] mb-3 sm:mb-4 font-semibold text-sm sm:text-base">
              Hỗ Trợ
            </h4>

            <ul className="space-y-1 sm:space-y-2">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 text-xs sm:text-sm hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* EMAIL */}
          <div>
            <h4 className="text-[#a57172] mb-3 sm:mb-4 font-semibold text-sm sm:text-base">
              Đăng Ký Nhận Tin Ưu Đãi
            </h4>

            <div className="flex flex-col gap-2 sm:gap-3">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-white/10 text-xs sm:text-sm outline-none"
              />

              <button className="bg-[#7D1919] text-white py-2 sm:py-3 rounded-full font-medium hover:opacity-90 text-sm">
                Đăng ký ngay
              </button>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              {[Facebook, Instagram, Phone].map((Icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer"
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>© 2026 The GaBo. All rights reserved.</p>

          <div className="flex gap-6 mt-3 md:mt-0 font-medium">
            <div>Privacy Policy</div>
            <div>Terms of Service</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
