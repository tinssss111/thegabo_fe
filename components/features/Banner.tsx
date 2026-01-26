"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BannerProps {
  title?: string;
  subtitle?: string;
  period?: string;
  imageUrl?: string;
}

export default function Banner({
  imageUrl = "/images/banner.jpg",
}: BannerProps) {
  const popularTags = [
    "Cơm gà",
    "Cơm bò",
    "Cơm thịt chiên",
    "Mì bò",
    "Mì xúc xích",
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full relative min-h-screen flex items-center overflow-hidden bg-[#D4A849]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Banner Background"
          fill
          className="object-cover opacity-90"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4">
        <div
          className={`max-w-2xl mx-auto px-4 transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
          `}
        >
          {/* Search Bar */}
          <div className="mb-8 delay-100">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for recipes"
                className="w-full px-6 py-4 pr-12 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900">
                <Search className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {popularTags.map((tag, index) => (
              <button
                key={index}
                style={{ transitionDelay: `${index * 80}ms` }}
                className={`px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md text-md
                  transition-all duration-500
                  ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                  hover:bg-black shadow-md hover:shadow-lg`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Main Title */}
        <div
          className={`text-center transition-all duration-700 delay-300 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
          `}
        >
          <h1 className="text-white text-4xl lg:text-2xl font-bold tracking-[0.8em] uppercase">
            ALL ABOUT NOODLE & FOOD
          </h1>
        </div>
      </div>
    </section>
  );
}
