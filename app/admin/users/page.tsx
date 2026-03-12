/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import Loader from "@/components/ui/Loader";
import {
  Edit,
  User as UserIcon,
  Search,
  RefreshCcw,
  ChevronDown,
  Filter,
  Lock,
  Unlock,
  ShieldAlert,
} from "lucide-react";
import { User } from "@/types/user";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Filter states
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form states
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params: any = {
        page,
        limit,
        sortBy: "createdAt",
        order: "desc",
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter !== "") params.role = parseInt(roleFilter);
      if (activeFilter !== "") params.isActive = activeFilter === "true";

      const response = await userService.getUsers(params);

      if (response.success && response.data) {
        setUsers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách người dùng");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, activeFilter, debouncedSearch]);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdating(true);
      const newActiveStatus = !selectedUser.isActive;
      const response = await userService.updateUserStatus(
        selectedUser._id,
        newActiveStatus,
      );

      if (response.success) {
        setUsers(
          users.map((u) =>
            u._id === selectedUser._id
              ? { ...u, isActive: newActiveStatus }
              : u,
          ),
        );
        setShowStatusModal(false);
        setSelectedUser(null);
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Lỗi khi cập nhật trạng thái",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setIsUpdating(true);
      const response = await userService.updateUser(
        selectedUser._id,
        editFormData,
      );

      if (response.success && response.data) {
        setUsers(
          users.map((u) => (u._id === selectedUser._id ? response.data : u)),
        );
        setShowEditModal(false);
        setSelectedUser(null);
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Lỗi khi cập nhật người dùng",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleLabel = (role?: number) => {
    if (role === 1) return "Admin";
    return "Khách hàng";
  };

  const getRoleColor = (role?: number) => {
    if (role === 1) return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div>
      {/* Filters & Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SDT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] text-sm transition-all shadow-sm rounded-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            {/* Role Filter */}
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] text-sm font-medium text-gray-700 bg-white appearance-none min-w-[150px] cursor-pointer shadow-sm transition-all"
              >
                <option value="">Tất cả vai trò</option>
                <option value="0">Khách hàng</option>
                <option value="1">Admin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] text-sm font-medium text-gray-700 bg-white appearance-none min-w-[150px] cursor-pointer shadow-sm transition-all"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Đã khóa</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("");
                setActiveFilter("");
                setPage(1);
              }}
              className="px-4 py-3 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2 justify-center transition-all shadow-sm group"
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

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-96">
          <Loader size={40} />
        </div>
      ) : (
        <>
          <div className="bg-white overflow-hidden rounded-lg border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ngày đăng ký
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                          Không tìm thấy người dùng nào
                        </p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.fullName || "Khách"}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {user._id.slice(-6).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phoneNumber || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleColor(user.role)}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                              user.isActive
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
                            ></span>
                            {user.isActive ? "Hoạt động" : "Đã khóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setEditFormData({
                                  fullName: user.fullName || "",
                                  phoneNumber: user.phoneNumber || "",
                                });
                                setShowEditModal(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-[#FE722D] hover:bg-orange-50 rounded-lg transition-colors"
                              title="Chỉnh sửa thông tin"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowStatusModal(true);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                user.isActive
                                  ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                                  : "text-red-500 hover:text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                user.isActive
                                  ? "Khóa tài khoản"
                                  : "Mở khóa tài khoản"
                              }
                            >
                              {user.isActive ? (
                                <Lock size={18} />
                              ) : (
                                <Unlock size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <p className="text-sm text-gray-600 font-medium">
                Trang{" "}
                <span className="font-bold text-gray-900">
                  {pagination.page}
                </span>{" "}
                / {pagination.totalPages} (Tổng{" "}
                <span className="font-bold text-gray-900">
                  {pagination.total}
                </span>
                )
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1 max-w-[200px] overflow-x-auto no-scrollbar">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] px-2 py-1.5 text-sm font-bold border transition-colors ${
                        page === p
                          ? "bg-[#113A28] text-white border-[#113A28]"
                          : "bg-white border-transparent hover:border-gray-200 text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lock/Unlock Modal */}
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${selectedUser.isActive ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
            >
              {selectedUser.isActive ? (
                <Lock size={24} />
              ) : (
                <Unlock size={24} />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {selectedUser.isActive ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
            </h3>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn {selectedUser.isActive ? "khóa" : "mở khóa"}{" "}
              tài khoản của{" "}
              <strong className="text-gray-900">
                {selectedUser.fullName || selectedUser.email}
              </strong>
              ?
              {selectedUser.isActive &&
                " Người dùng sẽ không thể đăng nhập hoặc mua hàng nữa."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isUpdating}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={isUpdating}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  selectedUser.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdating && <Loader size={16} />}
                {selectedUser.isActive ? "Xác nhận khóa" : "Mở khóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FE722D] flex items-center justify-center border border-orange-200">
                <Edit size={20} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Sửa thông tin
                </h3>
                <p className="text-xs text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] outline-none transition-all"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phoneNumber}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE722D]/20 focus:border-[#FE722D] outline-none transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isUpdating}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#FE722D] hover:bg-[#e05d1b] rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating && <Loader size={16} />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
