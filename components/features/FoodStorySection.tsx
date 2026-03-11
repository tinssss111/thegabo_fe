/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 sm:px-6 md:px-30 bg-[#730003] text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-0 sm:px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 md:gap-12">
        {/* TEXT */}
        <div
          className={`space-y-4 sm:space-y-6 px-4 sm:px-0 transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="w-12 sm:w-16 h-0.75 bg-[#551B13]" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
            &quot;Ăn một bữa cơm,
            <br />
            <span className="font-bold ">nhớ một mái nhà&quot;</span>
          </h2>

          <p className="text-white/70">
            Không chỉ là một bữa ăn. Đó là cảm giác thân quen của bếp nhà.
          </p>
        </div>

        {/* IMAGE */}
        <div
          className={`relative flex justify-center mt-8 md:mt-0 transition-all duration-1000 delay-200 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="absolute w-40 h-40 sm:w-60 sm:h-60 md:w-105 md:h-105 bg-white/10 rounded-full blur-3xl"></div>
          <img
            src="/images/section.png"
            alt="food"
            className="relative z-10 object-contain w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
