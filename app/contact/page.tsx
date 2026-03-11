"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Toast from "@/components/ui/Toast";

export default function ContactPage() {
  const router = useRouter();
  const [visibleSections, setVisibleSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-[#730003]" />,
      label: "Điện thoại",
      value: "0932832004",
      href: "tel:84932832004",
    },
    {
      icon: <Mail className="w-6 h-6 text-[#730003]" />,
      label: "Email",
      value: "contact@thegabo.com",
      href: "mailto:contact@thegabo.com",
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#730003]" />,
      label: "Địa chỉ",
      value: "Khu Vực 6, An Bình, Ninh Kiều, Cần Thơ",
      href: "#",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#730003]" />,
      label: "Giờ hoạt động",
      value: "09:00 - 22:00 (Hàng ngày)",
      href: "#",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setToast({
        message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setToast({
        message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white mt-10">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-linear-to-r from-[#730003] to-[#8f1b1b]">
          <div className="absolute inset-0 opacity-10" />
          <div className="relative z-10 text-center px-4 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase mb-3">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-white/90 text-xs sm:text-base max-w-lg mx-auto font-medium">
              Chúng tôi luôn sẵn sàng lắng nghe bạn
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-20">
          {/* Back Button */}
          <div className="mb-12 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
            </button>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tighter uppercase">
              Liên Hệ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div
              id="contact-form"
              data-animate
              className={`transition-all duration-1000 ease-out ${
                visibleSections["contact-form"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <h3 className="text-2xl font-medium text-gray-900 mb-6 tracking-tight">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D] focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D] focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0123 456 789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D] focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Tiêu đề tin nhắn"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D] focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D] focus:border-transparent outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-[#730003] text-white font-medium uppercase tracking-widest hover:bg-[#8f1b1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div
              id="contact-info"
              data-animate
              className={`transition-all duration-1000 ease-out ${
                visibleSections["contact-info"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <h3 className="text-2xl font-medium text-gray-900 mb-6 tracking-tight">
                Thông Tin Liên Hệ
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#FE722D] hover:shadow-lg transition-all group"
                  >
                    <div className="shrink-0 mt-1">{info.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {info.label}
                      </p>
                      <p className="text-base font-medium text-gray-900 group-hover:text-[#FE722D] transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map Section */}
              <div className="mt-8 rounded-lg overflow-hidden h-64 border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4408061149163!2d106.6927406!3d10.7769194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1da66ba2b5%3A0x3ccafcf35d66f1d!2zMTIzIEzc6i1M4buJ!5e0!3m2!1svi!2s!4v1234567890"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
}
