/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  category: string;
  available: boolean;
}

export default function MenuManagement() {
  const [items] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Phở Bò Tây Ninh",
      restaurant: "Phở Gia",
      price: 60000,
      category: "Phở",
      available: true,
    },
    {
      id: "2",
      name: "Bún Chả",
      restaurant: "Bún Chả Hà Nội",
      price: 50000,
      category: "Bún",
      available: true,
    },
    {
      id: "3",
      name: "Bánh Mì Thịt Nạc",
      restaurant: "Bánh Mì 68",
      price: 25000,
      category: "Bánh Mì",
      available: false,
    },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Menu</h1>
          <p className="text-gray-600 mt-2">Quản lý tất cả các món ăn</p>
        </div>
        <button className="px-4 py-2 bg-[#FE722D] text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
          + Thêm món ăn
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]">
          <option value="">Tất cả danh mục</option>
          <option value="pho">Phở</option>
          <option value="bun">Bún</option>
          <option value="banh-mi">Bánh Mì</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]">
          <option value="">Tất cả trạng thái</option>
          <option value="available">Còn hàng</option>
          <option value="unavailable">Hết hàng</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.restaurant}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.available ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">Danh mục: {item.category}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {item.price.toLocaleString()}₫
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Chỉnh sửa
              </button>
              <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
