/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalOrders: number;
}

export default function RestaurantsManagement() {
  const [restaurants] = useState<Restaurant[]>([
    {
      id: "1",
      name: "Phở Gia",
      address: "123 Đường Nguyễn Huệ, HCM",
      phone: "0901234567",
      rating: 4.8,
      totalOrders: 450,
    },
    {
      id: "2",
      name: "Bún Chả Hà Nội",
      address: "45 Đường Trần Hưng Đạo, HCM",
      phone: "0912345678",
      rating: 4.6,
      totalOrders: 380,
    },
    {
      id: "3",
      name: "Bánh Mì 68",
      address: "78 Đường Lê Lợi, HCM",
      phone: "0923456789",
      rating: 4.7,
      totalOrders: 520,
    },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhà hàng</h1>
          <p className="text-gray-600 mt-2">Quản lý tất cả nhà hàng</p>
        </div>
        <button className="px-4 py-2 bg-[#FE722D] text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
          + Thêm nhà hàng
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhà hàng..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]">
          <option value="">Tất cả mức xếp hạng</option>
          <option value="5">5 sao</option>
          <option value="4">4+ sao</option>
          <option value="3">3+ sao</option>
        </select>
      </div>

      {/* Restaurants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {restaurant.name}
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    📍 {restaurant.address}
                  </p>
                  <p className="text-sm text-gray-600">📞 {restaurant.phone}</p>
                </div>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200 flex gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Xếp hạng</p>
                <p className="text-lg font-bold text-gray-900">
                  ⭐ {restaurant.rating}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tổng đơn hàng</p>
                <p className="text-lg font-bold text-gray-900">
                  {restaurant.totalOrders}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Xem chi tiết
              </button>
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
