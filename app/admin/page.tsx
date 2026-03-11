/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { orderService } from "@/services/orderService";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CheckSquare,
  Clock3,
  CreditCard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  cancelledOrders: number;
  paidOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: any[];
}

interface PerformanceMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month",
  );
  const [filterValue, setFilterValue] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getAdminOrders({
          limit: 1000,
          page: 1,
        });

        if (response.success && response.data) {
          setAllOrders(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Xử lý dữ liệu Stats và Biểu đồ
  const { stats, chartData } = useMemo(() => {
    const filteredOrders = allOrders.filter((order: any) => {
      if (!filterValue) return true;
      if (!order.createdAt) return true;
      try {
        const orderDateStr = new Date(order.createdAt).toISOString();
        return orderDateStr.startsWith(filterValue);
      } catch (e) {
        return true;
      }
    });

    // Logic cho biểu đồ
    const dataMap: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      let label = "";
      if (filterType === "month") label = `Ngày ${date.getDate()}`;
      else if (filterType === "year") label = `Tháng ${date.getMonth() + 1}`;
      else
        label = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      dataMap[label] = (dataMap[label] || 0) + (order.total || 0);
    });

    const chartArray = Object.keys(dataMap).map((key) => ({
      name: key,
      revenue: dataMap[key],
    }));

    const paidOrders = filteredOrders.filter(
      (o: any) => o.paymentStatus === "paid",
    );

    const statsObj = {
      totalOrders: filteredOrders.length,
      deliveredOrders: filteredOrders.filter(
        (o: any) => o.orderStatus === "delivered",
      ).length,
      pendingOrders: filteredOrders.filter(
        (o: any) => o.orderStatus === "pending",
      ).length,
      confirmedOrders: filteredOrders.filter(
        (o: any) => o.orderStatus === "confirmed",
      ).length,
      processingOrders: filteredOrders.filter((o: any) =>
        ["preparing", "shipping"].includes(o.orderStatus),
      ).length,
      cancelledOrders: filteredOrders.filter(
        (o: any) => o.orderStatus === "cancelled",
      ).length,
      paidOrders: paidOrders.length,
      totalRevenue: paidOrders.reduce(
        (sum: number, o: any) => sum + (o.total || 0),
        0,
      ),
      ordersByStatus: {},
      recentOrders: filteredOrders.slice(0, 4),
    };

    return { stats: statsObj, chartData: chartArray };
  }, [allOrders, filterValue, filterType]);

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: "Hoàn Thành",
      value: stats?.deliveredOrders || 0,
      icon: (
        <div className=" text-emerald-600 rounded-xl">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      ),
    },
    {
      label: "Đơn Đã Hủy",
      value: stats?.cancelledOrders || 0,
      icon: (
        <div className=" text-red-600 rounded-xl">
          <XCircle className="w-5 h-5" />
        </div>
      ),
    },
    {
      label: "Đang Chuẩn Bị",
      value: stats?.processingOrders || 0,
      icon: (
        <div className=" text-amber-600 rounded-xl">
          <Clock3 className="w-5 h-5" />
        </div>
      ),
    },
    {
      label: "Đã Xác Nhận",
      value: stats?.confirmedOrders || 0,
      icon: (
        <div className=" text-blue-600 rounded-xl">
          <CheckSquare className="w-5 h-5" />
        </div>
      ),
    },
    {
      label: "Chờ Xác Nhận",
      value: stats?.pendingOrders || 0,
      icon: (
        <div className=" text-purple-600 rounded-xl">
          <Clock className="w-5 h-5" />
        </div>
      ),
    },
    {
      label: "Đã Thanh Toán",
      value: stats?.paidOrders || 0,
      icon: (
        <div className=" text-teal-600 rounded-xl">
          <CreditCard className="w-5 h-5" />
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={40} />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="space-y-8 pb-10 font-medium">
      {/* Tổng quan trạng thái đơn hàng */}
      <div className="bg-white rounded-2xl p-8 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-6 gap-4 border-b border-gray-50">
          <div>
            <h2 className="text-[22px] font-medium text-gray-900 tracking-tight">
              Tổng Quan Trạng Thái
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Thống kê đơn hàng theo trạng thái và thời gian.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <select
              value={filterType}
              onChange={(e) => {
                const val = e.target.value as any;
                setFilterType(val);
                const now = new Date();
                if (val === "day")
                  setFilterValue(now.toISOString().slice(0, 10));
                else if (val === "month")
                  setFilterValue(now.toISOString().slice(0, 7));
                else setFilterValue(now.toISOString().slice(0, 4));
              }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#D9FA76] focus:ring-1 focus:ring-[#D9FA76] shadow-sm appearance-none cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="day">Theo Ngày</option>
              <option value="month">Theo Tháng</option>
              <option value="year">Theo Năm</option>
            </select>
            <input
              type={
                filterType === "day"
                  ? "date"
                  : filterType === "month"
                    ? "month"
                    : "number"
              }
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#D9FA76] hover:border-gray-300 transition-colors"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <button
              className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium  hover:bg-gray-200 transition-colors"
              onClick={() => {
                setFilterType("month");
                setFilterValue("");
              }}
            >
              Tất cả
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {performanceMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-3 rounded-xl border border-gray-200 bg-white hover:bg-[#F2F3EE] transition-colors group"
            >
              <p className="text-gray-900 text-[13px] font-medium uppercase tracking-tight mb-1">
                {metric.label}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 scale-90 origin-left">
                  {metric.icon}
                </span>
                <span className="text-[12px] text-gray-500 font-medium">
                  {metric.value.toLocaleString()} đơn
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiệu suất doanh thu - Biểu đồ */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-[22px] font-medium text-gray-900 tracking-tight">
                Hiệu Suất Doanh Thu
              </h3>
              <div className="flex items-end gap-6 mt-6">
                <p className="text-[40px] leading-none font-bold text-gray-900 tracking-tight">
                  {stats?.totalRevenue.toLocaleString() || "0"} VNĐ
                </p>
                <div className="bg-emerald-50 text-emerald-600 text-sm font-bold px-3 py-1.5 rounded-md mb-1.5 flex items-center gap-1.5">
                  ↑ 12%{" "}
                  <span className="text-emerald-700/60 font-medium">
                    so với tháng trước
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mt-3">
                {new Date().toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Biểu đồ Recharts thực tế */}
          <div className="h-62.5 mt-8 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`}
                />
                <Tooltip
                  cursor={{ fill: "#F2F3EE" }}
                  content={({ active, payload }) => {
                    if (active && payload?.length)
                      return (
                        <div className="bg-[#1a4d3a] text-white p-3 rounded-lg shadow-xl border-none">
                          <p className="text-[10px] opacity-70 uppercase font-bold">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-sm font-bold">
                            {payload[0].value?.toLocaleString()} VNĐ
                          </p>
                        </div>
                      );
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 6, 6]} barSize={35}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        index === chartData.length - 1 ? "#FF7347" : "#e5e7eb"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Đơn hàng gần đây */}
        <div className="bg-white rounded-2xl p-8 border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium text-gray-900 tracking-tight">
              Đơn Hàng Gần Đây
            </h3>
            <Link
              href="/admin/orders"
              className="text-[#FE722D] hover:text-orange-700 text-sm font-medium tracking-tight"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-6">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: any) => {
                const statusInfo = {
                  pending: {
                    label: "Chờ Xác Nhận",
                    color: "bg-purple-50 text-purple-600",
                  },
                  confirmed: {
                    label: "Đã Xác Nhận",
                    color: "bg-blue-50 text-blue-600",
                  },
                  preparing: {
                    label: "Đang Chuẩn Bị",
                    color: "bg-amber-50 text-amber-600",
                  },
                  shipping: {
                    label: "Đang Giao",
                    color: "bg-cyan-50 text-cyan-600",
                  },
                  delivered: {
                    label: "Hoàn Thành",
                    color: "bg-emerald-50 text-emerald-600",
                  },
                  cancelled: {
                    label: "Đã Hủy",
                    color: "bg-red-50 text-red-600",
                  },
                }[order.orderStatus as string] || {
                  label: order.orderStatus,
                  color: "bg-gray-50 text-gray-600",
                };

                return (
                  <div
                    key={order._id}
                    className="pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {order.user?.fullName ||
                            order.user?.name ||
                            "Khách hàng"}
                        </p>
                      </div>
                      <span
                        className={`text-[12px] font-medium px-2 py-1 rounded-md ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.total?.toLocaleString()} VNĐ
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center font-medium py-10 text-sm">
                Chưa có đơn hàng nào.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
