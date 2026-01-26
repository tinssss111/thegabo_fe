"use client";

interface FilterTabsProps {
  text: string;
}

export default function FilterTabs({ text }: FilterTabsProps) {
  return (
    <section className="w-full bg-white py-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <div className="absolute left-0 -top-12">
              <div className="w-8 h-8 bg-[#FE722D] rounded-full" />
            </div>

            <h2 className="text-black font-medium text-4xl lg:text-2xl tracking-[0.5em] text-center uppercase">
              {text}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
