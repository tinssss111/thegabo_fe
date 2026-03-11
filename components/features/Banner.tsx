"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface BannerProps {
  imageUrl?: string;
}

export default function Banner({
  imageUrl = "/images/banner3.png",
}: BannerProps) {
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
    <section
      ref={sectionRef}
      className="w-full relative min-h-125 sm:min-h-150 md:min-h-screen flex items-center sm:items-start justify-center pt-12 sm:pt-16 md:pt-32 lg:pt-50 overflow-hidden bg-[#7b0000]"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Banner Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center mb-40 flex flex-col items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-4 max-w-full">
        {/* Description */}
        <h1
          className={`text-white text-3xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-light leading-tight transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Cơm Ngon Mỗi Ngày
        </h1>

        <p
          className={`text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl opacity-90 transition-all duration-1000 delay-200 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Đặt ngay để thưởng thức
        </p>
      </div>
    </section>
  );
}
