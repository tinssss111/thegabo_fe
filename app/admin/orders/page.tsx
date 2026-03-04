/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { restaurantService } from "@/services/restaurantService";
import Loader from "@/components/ui/Loader";
import ProcessSteps from "@/components/ui/ProcessSteps";
import {
  Eye,
  Edit,
  User,
  Search,
  RefreshCcw,
  ChevronDown,
  CreditCard,
  Filter,
  MapPin,
  Phone,
  FileText,
  Truck,
  X,
} from "lucide-react";
import { Order } from "@/types/order";

interface OrderData {
  _id: string;
  orderNumber: string;
  user?: {
    fullName?: string;
    name?: string;
    email?: string;
    _id?: string;
    avatar?: string;
  };
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Filter states
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullOrderDetail, setFullOrderDetail] = useState<Order | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [enrichedRestaurant, setEnrichedRestaurant] = useState<any | null>(
    null,
  );
  const [enrichedUser, setEnrichedUser] = useState<any | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await orderService.getAdminOrders({
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        search: debouncedSearch || undefined,
        page,
        limit,
        sortBy: "createdAt",
        order: "desc",
      });

      if (response.success && response.data) {
        // Lấy thêm thông tin chi tiết của user (như avatar, tên đầy đủ) do API order có thể không trả về đủ
        const enrichedOrders = await Promise.all(
          response.data.map(async (order: OrderData) => {
            if (order.user?._id) {
              try {
                const userDetailResp = await userService.getUserById(
                  order.user._id,
                );
                if (userDetailResp.success && userDetailResp.data) {
                  order.user = {
                    ...order.user,
                    avatar: userDetailResp.data.avatar || order.user.avatar,
                    fullName:
                      userDetailResp.data.fullName || order.user.fullName,
                    email: userDetailResp.data.email || order.user.email,
                  };
                }
              } catch {
                // Bỏ qua lỗi nếu không lấy được thông tin chi tiết của user
              }
            }
            return order;
          }),
        );

        setOrders(enrichedOrders);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách đơn hàng");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on mount and when filters change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderStatus, paymentStatus, debouncedSearch]);

  const loadOrderDetail = async (orderId: string) => {
    try {
      setIsLoadingDetail(true);
      setDetailError(null);
      setEnrichedRestaurant(null);
      setEnrichedUser(null);

      const response = await orderService.getOrderById(orderId);
      if (response.data) {
        setFullOrderDetail(response.data);

        // Load additional restaurant details if phone is missing
        if (response.data.restaurant?._id) {
          try {
            const restaurantData = await restaurantService.getRestaurantById(
              response.data.restaurant._id,
            );
            setEnrichedRestaurant(restaurantData);
          } catch (restaurantError) {
            console.warn("Could not load restaurant details:", restaurantError);
          }
        }

        // Load additional user details if phone is missing
        if (response.data.user?._id) {
          try {
            const userData = await userService.getUserById(
              response.data.user._id,
            );
            if (userData.success && userData.data) {
              setEnrichedUser(userData.data);
            }
          } catch (userError) {
            console.warn("Could not load user details:", userError);
          }
        }
      }
    } catch (error: any) {
      console.error("Error loading order detail:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải chi tiết đơn hàng";
      setDetailError(errorMsg);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      const response = await orderService.updateOrderStatus(
        selectedOrder._id,
        newStatus,
      );

      if (response.success) {
        // Update local state
        setOrders(
          orders.map((o) =>
            o._id === selectedOrder._id ? { ...o, orderStatus: newStatus } : o,
          ),
        );
        setShowStatusModal(false);
        setSelectedOrder(null);
        setNewStatus("");
      }
    } catch (err: any) {
      alert(err.message || "Lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "shipping":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "preparing":
        return "Đang chuẩn bị";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "failed":
        return "Thất bại";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Filters & Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          {/* 1. Thanh Search: Chiếm hết phần còn lại */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn hoặc tên khách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] text-sm transition-all shadow-sm"
            />
          </div>

          {/* 2. Nhóm bộ lọc */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            {/* Lọc Trạng thái đơn */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={orderStatus}
                onChange={(e) => {
                  setOrderStatus(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] text-sm font-medium text-gray-700 bg-white appearance-none min-w-45 cursor-pointer shadow-sm transition-all"
              >
                <option value="">Trạng thái đơn</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="preparing">Đang chuẩn bị</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Lọc Thanh toán */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={paymentStatus}
                onChange={(e) => {
                  setPaymentStatus(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] text-sm font-medium text-gray-700 bg-white appearance-none min-w-45 cursor-pointer shadow-sm transition-all"
              >
                <option value="">Thanh toán</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Nút Reset */}
            <button
              onClick={() => {
                setSearchQuery("");
                setOrderStatus("");
                setPaymentStatus("");
                setPage(1);
              }}
              className="px-4 py-3 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2 justify-center transition-all shadow-sm group"
              title="Đặt lại bộ lọc"
            >
              <RefreshCcw
                size={16}
                className="group-active:rotate-180 transition-transform duration-500"
              />
              <span className="text-sm font-medium sm:inline">Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-96">
          <Loader size={40} />
        </div>
      ) : (
        <>
          <div className="bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Ngày giờ giao hàng
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-900">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <p className="text-gray-600">Không có đơn hàng nào</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="relative group inline-flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            {order.user?.avatar ? (
                              <img
                                src={order.user.avatar}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg">
                            {order.user?.fullName ||
                              order.user?.name ||
                              "Khách hàng"}
                            {/* Mũi tên tooltip */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.total.toLocaleString()}₫
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.orderStatus,
                          )}`}
                        >
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.paymentStatus,
                          )}`}
                        >
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailsModal(true);
                              loadOrderDetail(order._id);
                            }}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chi tiết đơn hàng"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.orderStatus);
                              setShowStatusModal(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-[#FE722D] hover:bg-orange-50 rounded-lg transition-colors"
                            title="Cập nhật trạng thái"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <p className="text-sm text-gray-600 font-medium">
                Đang xem trang{" "}
                <span className="font-medium  text-gray-900">
                  {pagination.page}
                </span>{" "}
                / {pagination.totalPages} (Tổng{" "}
                <span className="font-medium  text-gray-900">
                  {pagination.totalItems}
                </span>{" "}
                đơn hàng)
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1 max-w-50 overflow-x-auto no-scrollbar">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-8 px-2 py-1.5 text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#113A28] text-white border border-[#113A28]"
                          : "border border-transparent hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Cập nhật trạng thái đơn hàng
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Mã đơn:</strong> {selectedOrder.orderNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.user?.fullName || selectedOrder.user?.name}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái mới
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full font-medium px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="preparing">Đang chuẩn bị</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === selectedOrder.orderStatus}
                className="flex-1 px-4 py-2 bg-[#113A28] text-white rounded-lg hover:bg-[#113A28] disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {isUpdating && <Loader size={16} />}
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-medium text-gray-900">
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedOrder(null);
                  setFullOrderDetail(null);
                  setDetailError(null);
                  setEnrichedRestaurant(null);
                  setEnrichedUser(null);
                  setEnrichedRestaurant(null);
                  setEnrichedUser(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
              {isLoadingDetail ? (
                <div className="flex justify-center items-center py-12">
                  <Loader size={40} />
                </div>
              ) : detailError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-700 font-medium mb-2">
                    Lỗi tải chi tiết đơn hàng
                  </p>
                  <p className="text-red-600 text-sm mb-4">{detailError}</p>
                  <button
                    onClick={() => {
                      if (selectedOrder) {
                        loadOrderDetail(selectedOrder._id);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Thử lại
                  </button>
                </div>
              ) : fullOrderDetail ? (
                <>
                  {/* SECTION 0: Order Status Progress */}
                  <div className="bg-white border border-gray-100 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Trạng thái đơn hàng
                      </h3>
                      <span className="text-gray-500 font-medium">
                        #{fullOrderDetail.orderNumber}
                      </span>
                    </div>
                    <ProcessSteps status={fullOrderDetail.orderStatus} />
                    <div className="mt-6 flex flex-row items-center justify-between gap-4">
                      <div className="flex items-center w-full">
                        <div className="flex-1">
                          <p className="font-medium text-lg text-gray-900">
                            {orderService.formatOrderStatus(
                              fullOrderDetail.orderStatus,
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(fullOrderDetail.updatedAt).toLocaleString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                      </div>
                      {fullOrderDetail.estimatedDeliveryTime && (
                        <div className="md:text-right shrink-0">
                          <p className="text-sm text-gray-500">
                            Dự kiến giao hàng
                          </p>
                          <p className="text-lg font-medium text-blue-600">
                            {new Date(
                              fullOrderDetail.estimatedDeliveryTime,
                            ).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 1: Order Header Info */}
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Mã đơn hàng
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          #{fullOrderDetail.orderNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Tổng tiền
                        </p>
                        <p className="text-lg font-medium text-[#FE722D]">
                          {fullOrderDetail.total.toLocaleString()}₫
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Ngày đặt hàng
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(fullOrderDetail.createdAt).toLocaleString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Cập nhật lúc
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(fullOrderDetail.updatedAt).toLocaleString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Delivery Route */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#FE722D]" />
                        Hành trình đơn hàng
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* FROM: Restaurant */}
                      <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Từ địa chỉ (Nhà hàng)
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">
                            {fullOrderDetail.restaurant?.name || "Nhà hàng"}
                          </h4>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {fullOrderDetail.restaurant?.address ||
                                enrichedRestaurant?.address ||
                                enrichedRestaurant?.addresses ||
                                "Địa chỉ không có sẵn"}
                            </span>
                          </div>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>
                              {fullOrderDetail.restaurant?.phone ||
                                enrichedRestaurant?.phone ||
                                enrichedRestaurant?.phoneNumber ||
                                "Số điện thoại không có sẵn"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* TO: Customer Address */}
                      <div className="p-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Đến địa chỉ (Người nhận)
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">
                            {fullOrderDetail.user?.name || "Khách hàng"}
                          </h4>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {fullOrderDetail.deliveryAddress ||
                                "Địa chỉ giao hàng không có sẵn"}
                            </span>
                          </div>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>
                              {fullOrderDetail.user?.phone ||
                                enrichedUser?.phone ||
                                enrichedUser?.phoneNumber ||
                                "Không có số điện thoại"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipper Info */}
                    {fullOrderDetail.shipper && (
                      <div className="bg-emerald-50 border-t border-emerald-100 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-full">
                            <Truck className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-900">
                              Shipper đang giao hàng
                            </p>
                            <p className="text-xs text-emerald-700">
                              {fullOrderDetail.shipper.name} •{" "}
                              {fullOrderDetail.shipper.vehicleNumber}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`tel:${fullOrderDetail.shipper.phone}`}
                          className="p-2 bg-white rounded-full shadow-sm text-emerald-700 hover:bg-emerald-50"
                          title="Gọi shipper"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: Customer Information */}
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase">
                      Thông tin khách hàng
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Tên khách hàng:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {fullOrderDetail.user?.name ||
                            enrichedUser?.fullName ||
                            enrichedUser?.name ||
                            fullOrderDetail.user?._id ||
                            "Không có tên"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {fullOrderDetail.user?.email ||
                            enrichedUser?.email ||
                            "Không có email"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Số điện thoại:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {fullOrderDetail.user?.phone ||
                            enrichedUser?.phone ||
                            enrichedUser?.phoneNumber ||
                            "Không có số điện thoại"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: Order Items */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#FE722D]" />
                        Danh sách sản phẩm
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {fullOrderDetail.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          <img
                            src={item.food.image}
                            alt={item.food.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-gray-900">
                                {item.food.name}
                              </p>
                              <p className="font-medium text-gray-900">
                                {(
                                  item.price * item.quantity +
                                  (item.selectedOptions?.reduce(
                                    (sum, opt) => sum + opt.price,
                                    0,
                                  ) || 0) *
                                    item.quantity
                                ).toLocaleString()}
                                ₫
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                              <p className="text-gray-600">
                                Giá: {item.price.toLocaleString()}₫ ×{" "}
                                {item.quantity} ={" "}
                                {(item.price * item.quantity).toLocaleString()}₫
                              </p>
                              {item.selectedOptions &&
                                item.selectedOptions.length > 0 && (
                                  <div className="space-y-0.5">
                                    {item.selectedOptions.map((opt, i) => (
                                      <p
                                        key={i}
                                        className="text-[#FE722D] font-medium"
                                      >
                                        + {opt.addonName}:{" "}
                                        {opt.price.toLocaleString()}₫ ×{" "}
                                        {item.quantity}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              {item.note && (
                                <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit mt-1">
                                  Note: {item.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 5: Order Note */}
                  {fullOrderDetail.note && (
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                      <p className="text-sm font-semibold text-orange-900 mb-2">
                        Ghi chú đơn hàng
                      </p>
                      <p className="text-sm text-orange-800">
                        {fullOrderDetail.note}
                      </p>
                    </div>
                  )}

                  {/* SECTION 6: Payment Breakdown */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#FE722D]" />
                      Chi tiết thanh toán
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="font-medium text-gray-900">
                          {fullOrderDetail.subtotal.toLocaleString()}₫
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí giao hàng</span>
                        <span className="font-medium text-gray-900">
                          {fullOrderDetail.deliveryFee.toLocaleString()}₫
                        </span>
                      </div>
                      {fullOrderDetail.estimatedDeliveryTime && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Dự kiến giao hàng
                          </span>
                          <span className="font-medium text-gray-900">
                            {new Date(
                              fullOrderDetail.estimatedDeliveryTime,
                            ).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Tổng thanh toán
                        </span>
                        <span className="text-xl font-bold text-[#FE722D]">
                          {fullOrderDetail.total.toLocaleString()}₫
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded flex items-center justify-between mt-3">
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {fullOrderDetail.paymentMethod || "Không xác định"}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold uppercase ${fullOrderDetail.paymentStatus === "paid" ? "text-green-700" : fullOrderDetail.paymentStatus === "pending" ? "text-yellow-700" : "text-red-700"}`}
                        >
                          {getPaymentStatusLabel(fullOrderDetail.paymentStatus)}
                        </span>
                      </div>
                      {fullOrderDetail.paymentTransactionId && (
                        <div className="text-xs text-gray-500 mt-2">
                          ID giao dịch:{" "}
                          <span className="font-mono text-gray-700">
                            {fullOrderDetail.paymentTransactionId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Không thể tải dữ liệu đơn hàng
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {fullOrderDetail && !detailError && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3 rounded-b-xl">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                    setFullOrderDetail(null);
                    setDetailError(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
