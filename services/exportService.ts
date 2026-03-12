import * as XLSX from "xlsx";
import { Order } from "@/types/order";

interface ExportMetrics {
  byCustomer: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    purchaseFrequency: number;
    revenue: number;
    profit: number;
  }[];
  byRestaurant: {
    restaurantId: string;
    restaurantName: string;
    purchaseFrequency: number;
    revenue: number;
    profit: number;
  }[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalProfit: number;
  };
}

export const exportService = {
  /**
   * Tính toán lợi nhuận từ đơn hàng
   * Lợi nhuận = tổng tiền - phí giao hàng
   * (Có thể điều chỉnh công thức tùy vào logic kinh doanh)
   */
  calculateProfit(order: Order): number {
    // Lợi nhuận = subtotal (không tính phí giao)
    // Hoặc có thể là: total - deliveryFee
    return order.subtotal;
  },

  /**
   * Tính toán doanh thu từ một đơn hàng
   * Doanh thu = tổng tiền bao gồm phí giao
   */
  calculateRevenue(order: Order): number {
    return order.total;
  },

  /**
   * Tích hợp dữ liệu đơn hàng thành các chỉ số
   */
  aggregateMetrics(orders: Order[]): ExportMetrics {
    // Lọc chỉ những đơn hàng đã thanh toán hoặc đã giao
    const validOrders = orders.filter(
      (order) =>
        order.paymentStatus === "paid" &&
        (order.orderStatus === "delivered" ||
          order.orderStatus !== "cancelled"),
    );

    // Tính toán theo khách hàng
    const customerMap: Record<
      string,
      {
        customerId: string;
        customerName: string;
        customerEmail: string;
        count: number;
        revenue: number;
        profit: number;
      }
    > = {};

    // Tính toán theo nhà hàng
    const restaurantMap: Record<
      string,
      {
        restaurantId: string;
        restaurantName: string;
        count: number;
        revenue: number;
        profit: number;
      }
    > = {};

    let totalRevenue = 0;
    let totalProfit = 0;

    validOrders.forEach((order) => {
      const revenue = this.calculateRevenue(order);
      const profit = this.calculateProfit(order);

      totalRevenue += revenue;
      totalProfit += profit;

      // Tính theo khách hàng
      const customerId = order.user._id;
      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          customerId,
          customerName: order.user.name,
          customerEmail: order.user.email,
          count: 0,
          revenue: 0,
          profit: 0,
        };
      }
      customerMap[customerId].count++;
      customerMap[customerId].revenue += revenue;
      customerMap[customerId].profit += profit;

      // Tính theo nhà hàng
      const restaurantId = order.restaurant._id;
      if (!restaurantMap[restaurantId]) {
        restaurantMap[restaurantId] = {
          restaurantId,
          restaurantName: order.restaurant.name,
          count: 0,
          revenue: 0,
          profit: 0,
        };
      }
      restaurantMap[restaurantId].count++;
      restaurantMap[restaurantId].revenue += revenue;
      restaurantMap[restaurantId].profit += profit;
    });

    return {
      byCustomer: Object.values(customerMap).map((c) => ({
        customerId: c.customerId,
        customerName: c.customerName,
        customerEmail: c.customerEmail,
        purchaseFrequency: c.count,
        revenue: parseFloat(c.revenue.toFixed(2)),
        profit: parseFloat(c.profit.toFixed(2)),
      })),
      byRestaurant: Object.values(restaurantMap).map((r) => ({
        restaurantId: r.restaurantId,
        restaurantName: r.restaurantName,
        purchaseFrequency: r.count,
        revenue: parseFloat(r.revenue.toFixed(2)),
        profit: parseFloat(r.profit.toFixed(2)),
      })),
      summary: {
        totalOrders: validOrders.length,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
      },
    };
  },

  /**
   * Xuất dữ liệu đơn hàng ra Excel
   */
  exportOrdersToExcel(orders: Order[], fileName: string = "don_hang_report") {
    const metrics = this.aggregateMetrics(orders);

    // Tạo workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Tóm tắt chung
    const summarySheet = [
      ["BÁO CÁO DOANH SỐ VÀ LỢI NHUẬN"],
      ["Ngày xuất:", new Date().toLocaleDateString("vi-VN")],
      [],
      ["TỔNG HỢP CHUNG"],
      ["Tổng số đơn hàng:", metrics.summary.totalOrders],
      ["Tổng doanh thu:", metrics.summary.totalRevenue, "VND"],
      ["Tổng lợi nhuận:", metrics.summary.totalProfit, "VND"],
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summarySheet);
    summaryWS["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Tóm tắt");

    // Sheet 2: Chi tiết theo khách hàng
    const customerHeaders = [
      "STT",
      "Tên khách hàng",
      "Email",
      "Tần suất mua hàng",
      "Doanh thu (VND)",
      "Lợi nhuận (VND)",
    ];
    const customerData = metrics.byCustomer.map((customer, index) => [
      index + 1,
      customer.customerName,
      customer.customerEmail,
      customer.purchaseFrequency,
      customer.revenue,
      customer.profit,
    ]);

    const customerWS = XLSX.utils.aoa_to_sheet([
      customerHeaders,
      ...customerData,
    ]);
    customerWS["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    // Định dạng header
    for (let i = 0; i < customerHeaders.length; i++) {
      const cell = customerWS[XLSX.utils.encode_col(i) + "1"];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, customerWS, "Theo khách hàng");

    // Sheet 3: Chi tiết theo nhà hàng
    const restaurantHeaders = [
      "STT",
      "Tên nhà hàng",
      "Tần suất mua hàng",
      "Doanh thu (VND)",
      "Lợi nhuận (VND)",
    ];
    const restaurantData = metrics.byRestaurant.map((restaurant, index) => [
      index + 1,
      restaurant.restaurantName,
      restaurant.purchaseFrequency,
      restaurant.revenue,
      restaurant.profit,
    ]);

    const restaurantWS = XLSX.utils.aoa_to_sheet([
      restaurantHeaders,
      ...restaurantData,
    ]);
    restaurantWS["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    // Định dạng header
    for (let i = 0; i < restaurantHeaders.length; i++) {
      const cell = restaurantWS[XLSX.utils.encode_col(i) + "1"];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, restaurantWS, "Theo nhà hàng");

    // Sheet 4: Chi tiết từng đơn hàng
    const orderHeaders = [
      "Số đơn hàng",
      "Khách hàng",
      "Nhà hàng",
      "Doanh thu (VND)",
      "Ngày đặt hàng",
      "Trạng thái",
    ];
    const orderData = orders
      .filter((order) => order.paymentStatus === "paid")
      .map((order) => [
        order.orderNumber,
        order.user.name,
        order.restaurant.name,
        order.total,
        new Date(order.createdAt).toLocaleDateString("vi-VN"),
        this.getOrderStatusLabel(order.orderStatus),
      ]);

    const orderWS = XLSX.utils.aoa_to_sheet([orderHeaders, ...orderData]);
    orderWS["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
    ];

    // Định dạng header
    for (let i = 0; i < orderHeaders.length; i++) {
      const cell = orderWS[XLSX.utils.encode_col(i) + "1"];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, orderWS, "Chi tiết đơn hàng");

    // Xuất file
    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
  },

  /**
   * Chuyển đổi trạng thái đơn hàng sang tiếng Việt
   */
  getOrderStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      preparing: "Đang chuẩn bị",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  },
};
