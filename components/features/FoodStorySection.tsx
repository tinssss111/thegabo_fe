"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function FoodStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.25 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_2fr] min-h-150">
        {/* LEFT PROMO CARD */}
        <div
          className={`bg-[#F5F5F5] flex flex-col min-h-150 transition-all duration-800 ease-out
            ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
          `}
        >
          {/* TOP HALF */}
          <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center">
            <div className="inline-block border border-black bg-[#FFFE95] rounded-full px-6 py-2 mb-8 text-sm">
              Ưu đãi tháng này
            </div>

            <h2 className="text-3xl lg:text-4xl font-medium leading-tight">
              Ăn Cơm & Mì
              <br />
              Ngon Mỗi Ngày
              <br />
              Giảm Đến 30%
            </h2>
          </div>

          {/* BOTTOM HALF */}
          <div className="relative flex-1 p-8">
            <Image
              src="/images/trai.png"
              alt="Combo cơm mì"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* RIGHT STORY HERO */}
        <div
          className={`relative overflow-hidden transition-all duration-800 ease-out
            ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}
          `}
        >
          {/* background food image */}
          <Image
            src="/images/phai.png"
            alt="Mì nóng hổi"
            fill
            className="object-cover"
          />

          {/* content box */}
          <div className="relative z-10 h-full flex items-center justify-end p-12 lg:p-20">
            <div
              className={`bg-[#DDCAB9] p-12 max-w-xl shadow-lg transition-all duration-700 delay-200 ease-out
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
              `}
            >
              <div className="inline-block border border-gray-700 rounded-full px-5 py-2 mb-6 text-sm">
                Khách hàng yêu thích
              </div>

              <h2 className="text-3xl lg:text-4xl text-gray-900 font-medium leading-snug mb-4">
                Cơm nóng - Mì tươi
                <br />
                Ngon như nhà nấu mỗi ngày!
              </h2>

              <p className="text-gray-700 mb-8 leading-relaxed">
                Từ cơm gà, cơm bò mì trộn – tất cả đều được nấu mỗi ngày với
                nguyên liệu tươi, giao nhanh trong 30 phút.
              </p>

              <a href="#menu-section">
                <button className="flex items-center bg-[#FFFE95] gap-3 border border-gray-900 rounded-full px-8 py-3 hover:bg-gray-900 hover:text-white transition">
                  Đặt món ngay
                  <span className="text-xl">→</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
