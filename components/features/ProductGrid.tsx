"use client";

import { Food } from "@/types/food";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Food[];
  onAddToCart?: (product: Food) => void;
}

export default function ProductGrid({
  products,
  onAddToCart,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
