"use client";

interface FilterTabsProps {
  text?: string;
  description?: string;
}

export default function FilterTabs({ text, description }: FilterTabsProps) {
  return (
    <section className="w-full bg-[#FBF2D7] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] text-center uppercase">
            {text}
          </h2>
          <div className="w-32 sm:w-40 md:w-48 h-1 bg-[#E9B61A]"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base tracking-widest text-center mt-2">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
