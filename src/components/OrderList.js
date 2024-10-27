import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineEye } from "react-icons/ai";
import {
  BsBoxSeam,
  BsTruck,
  BsCheckCircle,
  BsXCircle,
  BsClock,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import OrderDetailModal from "./OrderDetailModal"; // Import component modal

const OrderList = () => {
  // Nhận userId từ props
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
  const [modalOrder, setModalOrder] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/api/orders?userId=${userId}`); // Truyền userId vào API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        setOrders(data.data.nonComplete); // Assuming the API returns an array of orders
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      // Kiểm tra nếu userId hợp lệ
      fetchOrders();
    }
  }, [userId, API]); // Thêm userId vào dependency array
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending Confirmation":
        return <BsClock className="w-5 h-5 text-yellow-500" />;
      case "In Transit":
        return <BsTruck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <BsCheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <BsXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <BsBoxSeam className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending Confirmation":
        return "bg-yellow-50 text-yellow-600 ring-yellow-500/30";
      case "In Transit":
        return "bg-blue-50 text-blue-600 ring-blue-500/30";
      case "Delivered":
        return "bg-green-50 text-green-600 ring-green-500/30";
      case "Cancelled":
        return "bg-red-50 text-red-600 ring-red-500/30";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-500/30";
    }
  };

  const filteredOrders = orders
    .filter(
      (order) =>
        (statusFilter === "all" || order.status === statusFilter) &&
        (String(order.id).includes(searchTerm) || // Chuyển đổi order.id thành chuỗi
          order.items.some((item) => item.name.includes(searchTerm)))
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return <div className="text-center">Loading...</div>; // Loading message
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>; // Error message
  }

  return (
    <div className="mx-32 p-4 bg-gray-50/50 min-h-[580px] text-center">
      <div className="mb-6 bg-white rounded-lg shadow-sm p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Đơn hàng của tôi
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full h-11 px-4 pl-10 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Pending Confirmation">Chờ xác nhận</option>
                <option value="In Transit">Đang vận chuyển</option>
                <option value="Delivered">Đã giao</option>
                <option value="Cancelled">Đã hủy</option>
              </select>

              <button
                className="h-11 px-4 inline-flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              >
                <span>Ngày đặt</span>
                {sortOrder === "desc" ? (
                  <BsChevronDown className="w-4 h-4" />
                ) : (
                  <BsChevronUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ngày đặt:{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex items-center gap-2 text-xs font-medium rounded-full ring-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="text-sm text-gray-600 flex items-center gap-2"
                    >
                      <span className="font-medium">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {(order.total + order.shipping_fee).toLocaleString("vi-VN")}{" "}
                    ₫
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    sản phẩm
                  </p>
                </div>

                <button
                  onClick={() => setModalOrder(order)} // Đặt đơn hàng được chọn vào modalOrder
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-blue-500 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  Xem chi tiết <AiOutlineEye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalOrder && (
        <OrderDetailModal
          order={modalOrder}
          onClose={() => setModalOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList;
