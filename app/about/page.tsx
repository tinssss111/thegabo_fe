/* eslint-disable @next/next/no-img-element */
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, Leaf, ShieldCheck, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const router = useRouter();
  const [visibleSections, setVisibleSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Scroll observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "-50px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: <Leaf className="w-6 h-6 text-white" />,
      title: "Nguyên liệu tươi sạch",
      desc: "Chúng tôi lựa chọn khắt khe những nguyên liệu tự nhiên, đảm bảo nguồn gốc rõ ràng và độ tươi ngon mỗi ngày.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "An toàn thực phẩm",
      desc: "Quy trình chế biến khép kín, đạt chuẩn vệ sinh là ưu tiên hàng đầu để bảo vệ sức khỏe khách hàng.",
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Phục vụ nhanh chóng",
      desc: "Bữa ăn dinh dưỡng không có nghĩa là phải chờ đợi lâu. Chúng tôi tối ưu quy trình để món ăn đến tay bạn sớm nhất.",
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Tận tâm phục vụ",
      desc: "Mỗi hộp cơm trao đi là cả tâm huyết của đội ngũ THE GABO, mong muốn mang lại niềm vui trong từng bữa ăn.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white mt-10">
      <Header />

      <main className="flex-1">
        <section className="relative bg-[#730003] h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center px-4 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-4">
              THE GABO
            </h1>
            <p className="text-white/90 text-xs sm:text-base md:text-lg max-w-lg mx-auto font-medium leading-relaxed">
              Nơi mang đến những bữa ăn cân bằng, giàu dinh dưỡng và tràn đầy
              năng lượng cho ngày dài của bạn.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-20">
          <div className="mb-12 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
            </button>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Về chúng tôi
            </h2>
          </div>

          {/* Story Section */}
          <div
            id="story-section"
            data-animate
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-24 transition-all duration-1000 ease-out ${
              visibleSections["story-section"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
              <span className="text-[#FE722D] font-medium text-xs uppercase tracking-[0.2em]">
                Câu chuyện thương hiệu
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight">
                Ăn ngon để sống khỏe mỗi ngày
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium text-xs sm:text-sm md:text-base">
                Được thành lập từ niềm đam mê ẩm thực lành mạnh, THE GABO không
                chỉ bán món ăn, chúng tôi bán một lối sống.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium text-xs sm:text-sm md:text-base">
                Tại THE GABO, mỗi thực đơn đều được tính toán kỹ lưỡng về hàm
                lượng dinh dưỡng, giúp bạn duy trì vóc dáng bền bỉ.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg h-64 sm:h-80 md:h-96">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                alt="Healthy food"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 my-16 md:my-24"></div>

          {/* Core Values Section */}
          <div
            id="values-header"
            data-animate
            className={`text-center mb-12 md:mb-16 transition-all duration-1000 ease-out ${
              visibleSections["values-header"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h3 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tighter uppercase mb-4">
              Giá trị cốt lõi
            </h3>
            <p className="text-gray-500 font-medium text-xs sm:text-sm max-w-2xl mx-auto italic">
              &quot;Chúng tôi tin rằng thực phẩm tốt là nền tảng của một cuộc
              sống hạnh phúc&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((item, index) => (
              <div
                key={index}
                id={`value-${index}`}
                data-animate
                className={`p-4 sm:p-6 md:p-8 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg group bg-white ${
                  visibleSections[`value-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: visibleSections[`value-${index}`]
                    ? `${index * 100}ms`
                    : "0ms",
                }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#7D1919] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FE722D]/10 transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
