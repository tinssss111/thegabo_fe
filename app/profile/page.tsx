/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/order";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/ui/Loader";
import {
  User,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  RotateCcw,
  Eye,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    addresses: user?.addresses || "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        addresses: user.addresses || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, filter, page, dateFilter, startDate, endDate]);

  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const params: any = {
        page,
        limit: 4, // THAY ĐỔI TẠI ĐÂY: Chỉ lấy 3 sản phẩm mỗi trang
        sortBy: "createdAt",
        order: "desc",
      };

      if (filter !== "all") params.orderStatus = filter;

      if (dateFilter === "custom" && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (dateFilter !== "all") {
        const { start, end } = getDateRange(dateFilter);
        params.startDate = start.toISOString();
        params.endDate = end.toISOString();
      }

      const response = await orderService.getMyOrders(params);
      if (response.success) {
        setOrders(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Load orders error:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      addresses: user?.addresses || "",
    });
    setIsEditing(false);
  };

  const getDateRange = (filterType: string) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    switch (filterType) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(today.getDate() - 7);
        break;
      case "month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "3months":
        start.setMonth(today.getMonth() - 3);
        break;
    }
    return { start, end };
  };

  const resetFilters = () => {
    setFilter("all");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters = filter !== "all" || dateFilter !== "all";

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE - Profile Information */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 p-8 sticky top-24">
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                  <div className="relative mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-[#FE722D]/10 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#FE722D]/10 flex items-center justify-center border-4 border-white shadow-md">
                        <span className="text-[#FE722D] font-medium text-2xl ">
                          {user?.fullName?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-medium text-gray-900">
                    {user?.fullName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    {user?.email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-medium text-gray-400">
                      Thông tin cá nhân
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-[#FE722D] hover:bg-orange-50 rounded-full transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1.5 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-md font-medium text-gray-400  flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-[#FE722D]" /> Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full bg-white p-2 text-sm border border-gray-200 rounded outline-none focus:border-[#FE722D]"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-800">
                          {user?.fullName || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-md font-medium text-gray-400  flex items-center gap-2 mb-1">
                        <Phone className="w-3 h-3 text-[#FE722D]" /> Điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full bg-white p-2 text-sm border border-gray-200 rounded outline-none focus:border-[#FE722D]"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-800">
                          {user?.phoneNumber || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-md font-medium text-gray-400  flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-[#FE722D]" /> Địa chỉ
                      </label>
                      {isEditing ? (
                        <textarea
                          name="addresses"
                          value={formData.addresses}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-white p-2 text-sm border border-gray-200 rounded outline-none focus:border-[#FE722D] resize-none"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">
                          {user?.addresses || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - My Orders (Chỉ 3 đơn hàng) */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Đơn hàng gần đây
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-[11px] font-medium text-[#FE722D]  tracking-tighter flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Đặt lại
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-100">
                        <th className="px-6 py-4 text-md font-medium text-gray-400  ">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-4 text-md font-medium text-gray-400  text-center">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-md font-medium text-gray-400  text-right">
                          Tổng tiền
                        </th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {isLoadingOrders ? (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <div className="flex justify-center items-center">
                              <Loader size={35} />
                            </div>
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-20 text-center font-medium text-gray-400 text-sm"
                          >
                            Không có đơn hàng nào
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr
                            key={order._id}
                            className="hover:bg-gray-50/40 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={order.orderItems[0]?.food?.image}
                                    alt=""
                                    className="w-12 h-12 object-cover rounded-md border border-gray-100"
                                  />
                                  {order.orderItems.length > 1 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#FE722D] text-white text-sm w-4 h-4 flex items-center justify-center font-medium rounded-full border border-white">
                                      {order.orderItems.length - 1}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-gray-900 text-sm truncate max-w-37.5">
                                    {order.orderItems[0]?.food?.name}
                                  </span>
                                  <span className="text-md text-gray-400 font-medium mt-0.5">
                                    {new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded text-sm font-medium  tracking-tighter ${getStatusStyle(order.orderStatus)}`}
                              >
                                {orderService.formatOrderStatus(
                                  order.orderStatus,
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-gray-900 text-sm">
                              {order.total.toLocaleString()}đ
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button
                                onClick={() =>
                                  router.push(`/orders/${order._id}`)
                                }
                                className="p-2 text-gray-300 hover:text-[#FE722D] transition-colors"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination (Mini) */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <span className="text-md font-medium text-gray-400">
                    Trang {page} / {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1 text-md font-medium  tracking-tighter border rounded bg-white hover:bg-gray-50 disabled:opacity-20 transition-all"
                    >
                      Lùi
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1 text-md font-medium  tracking-tighter bg-[#FE722D] text-white rounded hover:bg-[#e0561c] shadow-sm shadow-orange-100 disabled:opacity-20 transition-all"
                    >
                      Tiếp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
