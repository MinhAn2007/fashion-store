import React, { useState, useEffect, useRef } from "react";
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
import OrderDetailModal from "./OrderDetailModal";
import CancelOrderModal from "./CancelOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";
import { formatPrice, downloadPDF } from "../utils/utils";
import { Loader } from "rizzui";
import { useAuthWithCheck } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CompleteOrderModal from "./CompleteOrderModal";
import io from "socket.io-client";
import Ably from "ably";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOrder, setModalOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const API = process.env.REACT_APP_API_ENDPOINT;
  const userId = localStorage.getItem("userId");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [orderToReturn, setOrderToReturn] = useState(null);
  const { checkApiResponse } = useAuthWithCheck();
  const navigate = useNavigate();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [orderToComplete, setOrderToComplete] = useState(null);
  const [socket, setSocket] = useState(null);


  const handleReturnOrder = (orderId) => {
    setOrderToReturn(orders.find((order) => order.id === orderId));
    setShowReturnModal(true);
  };
  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orders.find((order) => order.id === orderId));
    setShowCancelModal(true);
  };


  useEffect(() => {
    // Kết nối với Ably
    const ably = new Ably.Realtime('O4RrtQ.Xf-a8Q:0XE5QAwysrz56KobTV-_c0YyQJVSRHid8Z7sWs4b6DU');
    const channel = ably.channels.get('orders');
  
    ably.connection.on('connected', () => {
      console.log('Kết nối Ably thành công');
    });
  
    ably.connection.on('disconnected', () => {
      console.log('Kết nối Ably đã bị ngắt');
    });
  
    ably.connection.on('failed', (error) => {
      console.error('Kết nối Ably thất bại:', error);
    });
  
    channel.subscribe('order-status-updated', async (message) => {
      console.log('Thông điệp cập nhật trạng thái đơn hàng:', message);
  
      try {
        const response = await fetch(`${API}/api/orders?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
  
        const data = await response.json();
        setOrders(data.data.nonComplete);
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
      }
    });
  
    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [API, userId]);
  

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/orders?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.data.nonComplete);

      // Reset filter states
      setSearchTerm("");
      setStatusFilter("all");
      setSortOrder("desc");
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = (orderId) => {
    setOrderToComplete(orders.find((order) => order.id === orderId));
    setShowCompleteModal(true);
  };

  const confirmCompleteOrder = async () => {
    try {
      const response = await fetch(`${API}/api/orders/${orderToComplete.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Completed" }),
      });
      checkApiResponse(response);

      if (!response.ok) {
        alert("Đã xảy ra lỗi khi hoàn thành đơn hàng");
        return;
      }
      alert("Đã hoàn thành đơn hàng, vui lòng kiểm tra ở mục lịch sử mua hàng");
      navigate("/history");
    } catch (err) {
      console.error("Error completing order:", err);
    } finally {
      setShowCompleteModal(false);
      setOrderToComplete(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, API]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const statusTranslation = {
    "Pending Confirmation": "Chờ xác nhận",
    "In Transit": "Đang vận chuyển",
    Delivered: "Đã giao hàng",
    Processing: "Đang xử lý",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending Confirmation":
        return <BsClock className="w-5 h-5 text-yellow-500" />;
      case "In Transit":
        return <BsTruck className="w-5 h-5 text-blue-500" />;
      case "Cancelled":
        return <BsXCircle className="w-5 h-5 text-red-500" />;
      case "Completed":
        return <BsCheckCircle className="w-5 h-5 text-green-500" />;
      case "Processing":
        return <BsBoxSeam className="w-5 h-5 text-yellow-500" />;
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
      case "Completed":
        return "bg-green-50 text-green-600 ring-green-500/30";
      case "Processing":
        return "bg-yellow-50 text-yellow-600 ring-yellow-500/30";
      default:
        return "bg-gray-50 text-gray-600 ring-gray-500/30";
    }
  };

  const handleGetOrder = async (orderId, isGet) => {
    try {
      const response = await fetch(`${API}/api/orders/${orderId}/check`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isGet: isGet }),
      });
      checkApiResponse(response);
      if (!response.ok) {
        alert("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng");
        return;
      }
      alert("Cập nhật trạng thái đơn hàng thành công");
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "all" || order.status === statusFilter) &&
      (String(order.id).includes(searchTerm) ||
        order.items.some((item) => item.name.includes(searchTerm)))
  );

  const getLatestTimestamp = (order) => {
    const timestamps = [
      order.created_at,
      order.delivery_at,
      order.completed_at,
      order.canceled_at,
      order.returned_at,
      order.shipping_at,
      order.returned_at,
      order.updated_at,
    ].filter(Boolean);

    return new Date(Math.max(...timestamps.map((date) => new Date(date))));
  };

  const sortedOrders = filteredOrders.sort((a, b) => {
    const dateA = getLatestTimestamp(a);
    const dateB = getLatestTimestamp(b);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Tính toán lại totalPages mỗi khi danh sách đơn hàng thay đổi
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  // Lấy các đơn hàng theo trang
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Reset currentPage về 1 khi thay đổi bộ lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOrder]);

  if (loading)
    return (
      <div className="flex justify-center mx-auto min-h-[700px]">
        <Loader
          size="md"
          width={200}
          height={200}
          className="text-center my-40"
        />
      </div>
    );
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-[600px] mb-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Đơn hàng của tôi
        </h2>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              className="h-10 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(statusTranslation).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <button
              className="px-4 flex items-center gap-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
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

      {/* Orders List */}
      <div className="space-y-4">
        {currentOrders.map((order) => {
          const orderDate = new Date(order.created_at);
          const currentTime = new Date();
          const timeDiff = Math.floor((currentTime - orderDate) / 1000 / 60);
          const remainingTime = Math.max(30 - timeDiff, 0);

          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-lg font-medium">
                    Đơn hàng #{order.id}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    Thời gian cập nhật gần nhất:{" "}
                    {getLatestTimestamp(order).toLocaleString("vi-VN")}
                  </div>
                </div>
                {order.status === "Pending Confirmation" &&
                order.return_reason ? (
                  <span className="px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-500/30">
                    <BsClock className="w-5 h-5 text-orange-100-500" /> Đang yêu
                    cầu trả hàng
                  </span>
                ) : order.status === "Delivered" ? (
                  <>
                    {order.is_get === 0 ? (
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full ring-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        Chưa nhận hàng
                      </span>
                    ) : order.is_get === 1 ? (
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full ring-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.return_reason
                          ? "Shop đã nhận hàng trả"
                          : "Đã nhận hàng"}
                      </span>
                    ) : (
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full ring-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {" "}
                        {getStatusIcon(order.status)}
                        {statusTranslation[order.status] || order.status}
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full ring-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {statusTranslation[order.status] || order.status}
                  </span>
                )}
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-600">Tổng tiền:</span>
                    <span className="ml-2 text-lg font-semibold">
                      {formatPrice(order.total)}
                    </span>
                    {order.status === "Pending Confirmation" &&
                      remainingTime > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          Thời gian còn lại để hủy: {remainingTime} phút
                        </p>
                      )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-10 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      onClick={() => setModalOrder(order)}
                    >
                      <AiOutlineEye className="inline-block mr-2" />
                      Chi tiết
                    </button>
                    {order.status === "Pending Confirmation" &&
                      remainingTime > 0 && (
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Hủy đơn
                        </button>
                      )}
                    {order.status === "Delivered" &&
                      order.is_get === null &&
                      !order.return_reason && (
                        <>
                          <button
                            className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => handleGetOrder(order.id, 1)}
                          >
                            Đã nhận hàng
                          </button>
                          <button
                            className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => handleGetOrder(order.id)}
                          >
                            Chưa nhận hàng
                          </button>
                        </>
                      )}

                    {order.status === "Delivered" &&
                      order.is_get === 1 &&
                      !order.return_reason && (
                        <>
                          <button
                            className="px-4 py-2 text-sm font-medium text-black bg-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
                            onClick={() => handleCompleteOrder(order.id)}
                          >
                            Hoàn thành đơn hàng
                          </button>
                          <button
                            className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => handleReturnOrder(order.id)}
                          >
                            Trả hàng
                          </button>
                        </>
                      )}
                    {order.status === "Delivered" && order.is_get === 0 && (
                      <>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => handleReturnOrder(order.id)}
                        >
                          Trả hàng
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? "bg-gray-200" : "bg-black text-white"
          }`}
        >
          Trang trước
        </button>
        <span className="text-gray-700 my-auto">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages ? "bg-gray-200" : "bg-black text-white"
          }`}
        >
          Trang sau
        </button>
      </div>

      {modalOrder && (
        <OrderDetailModal
          order={modalOrder}
          onClose={() => setModalOrder(null)}
        />
      )}

      {showCancelModal && (
        <CancelOrderModal
          order={orderToCancel}
          onClose={() => {
            setShowCancelModal(false);
            setOrderToCancel(null);
          }}
        />
      )}

      {showReturnModal && (
        <ReturnOrderModal
          order={orderToReturn}
          onClose={() => {
            setShowReturnModal(false);
            setOrderToReturn(null);
          }}
        />
      )}
      {showCompleteModal && (
        <CompleteOrderModal
          orderId={orderToComplete?.id}
          onConfirm={confirmCompleteOrder}
          onClose={() => {
            setShowCompleteModal(false);
            setOrderToComplete(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderList;
