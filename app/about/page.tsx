"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, Leaf, ShieldCheck, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: <Leaf className="w-6 h-6 text-[#4A5D23]" />,
      title: "Nguyên liệu tươi sạch",
      desc: "Chúng tôi lựa chọn khắt khe những nguyên liệu tự nhiên, đảm bảo nguồn gốc rõ ràng và độ tươi ngon mỗi ngày.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4A5D23]" />,
      title: "An toàn thực phẩm",
      desc: "Quy trình chế biến khép kín, đạt chuẩn vệ sinh là ưu tiên hàng đầu để bảo vệ sức khỏe khách hàng.",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#4A5D23]" />,
      title: "Phục vụ nhanh chóng",
      desc: "Bữa ăn dinh dưỡng không có nghĩa là phải chờ đợi lâu. Chúng tôi tối ưu quy trình để món ăn đến tay bạn sớm nhất.",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#4A5D23]" />,
      title: "Tận tâm phục vụ",
      desc: "Mỗi hộp cơm trao đi là cả tâm huyết của đội ngũ THE GABO, mong muốn mang lại niềm vui trong từng bữa ăn.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white mt-10">
      <Header />

      <main className="flex-1">
        <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
            alt="The Gabo Kitchen"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative z-10 text-center px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase mb-4">
              THE GABO
            </h1>
            <p className="text-white/90 text-sm md:text-lg max-w-lg mx-auto font-medium leading-relaxed">
              Nơi mang đến những bữa ăn cân bằng, giàu dinh dưỡng và tràn đầy
              năng lượng cho ngày dài của bạn.
            </p>
          </motion.div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          <div className="mb-12 flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-7 h-7 text-black" />
            </button>
            <h2 className="text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Về chúng tôi
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-12 items-center mb-24"
          >
            <div className="space-y-6">
              <span className="text-[#FE722D] font-medium text-xs uppercase tracking-[0.2em]">
                Câu chuyện thương hiệu
              </span>
              <h3 className="text-3xl font-medium text-gray-900 tracking-tight">
                Ăn ngon để sống khỏe mỗi ngày
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
                Được thành lập từ niềm đam mê ẩm thực lành mạnh, THE GABO không
                chỉ bán món ăn, chúng tôi bán một lối sống.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
                Tại THE GABO, mỗi thực đơn đều được tính toán kỹ lưỡng về hàm
                lượng dinh dưỡng, giúp bạn duy trì vóc dáng bền bỉ.
              </p>
            </div>
            <div className="overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                alt="Healthy food"
                className="w-full h-full object-cover shadow-xl"
              />
            </div>
          </motion.div>

          <hr className="border-gray-100 mb-24" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 tracking-tighter uppercase mb-4">
              Giá trị cốt lõi
            </h3>
            <p className="text-gray-500 font-medium text-sm max-w-2xl mx-auto italic">
              &quot;Chúng tôi tin rằng thực phẩm tốt là nền tảng của một cuộc
              sống hạnh phúc&quot;
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-8 border border-gray-100 hover:border-[#D6E5BE] transition-all group bg-white hover:shadow-md"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D6E5BE]/20 transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-3 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-[#D6E5BE] py-16 px-4 text-center mt-20"
        >
          <h3 className="text-2xl md:text-3xl font-medium text-[#4A5D23] mb-6 tracking-tighter uppercase">
            Sẵn sàng thưởng thức bữa ăn lành mạnh?
          </h3>
          <button
            onClick={() => router.push("/")}
            className="px-10 py-4 bg-[#2D312E] text-white font-medium uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Khám phá thực đơn ngay
          </button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
