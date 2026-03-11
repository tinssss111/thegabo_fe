"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/features/Banner";
import FilterTabs from "@/components/features/FilterTabs";
import ProductGrid from "@/components/features/ProductGrid";
import FoodStorySection from "@/components/features/FoodStorySection";
import Loader from "@/components/ui/Loader";
import { foodService } from "@/services/foodService";
import { Food } from "@/types/food";

export default function Home() {
  const [selectedCategory] = useState<string>("all");
  const [, setCart] = useState<Food[]>([]);
  const [products, setProducts] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setIsLoading(true);
        const response = await foodService.getAllFoods();

        if (response.success && response.data) {
          setProducts(response.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to load products");
        console.error("Error fetching foods:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category.name === selectedCategory,
        );

  const handleAddToCart = (product: Food) => {
    setCart((prev) => [...prev, product]);
    console.log("Added to cart:", product.name);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-0">
        <Banner />
        <div className="" id="menu-section">
          <FilterTabs
            text="Món ngon hôm nay"
            description="Top những món được sinh viên yêu thích nhất tuần qua"
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader size={60} />
              <p className="text-gray-600 font-medium text-lg">
                Đang tải món ngon...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : (
            <div className="max-w-8xl mx-auto">
              <ProductGrid
                products={filteredProducts}
                onAddToCart={handleAddToCart}
              />
            </div>
          )}
        </div>
        <FoodStorySection />
      </main>
      <Footer />
    </div>
  );
}
