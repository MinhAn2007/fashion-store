import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiCheck,
  FiPackage,
  FiTruck,
  FiAlertCircle,
  FiX,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";
import { formatPrice } from "../utils/utils";
import { useAuthWithCheck } from "../hooks/useAuth";

const getStatusConfig = (status) => {
  const configs = {
    "Pending Confirmation": {
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-800",
      icon: FiClock,
    },
    "In Transit": {
      label: "Đang vận chuyển",
      color: "bg-blue-100 text-blue-800",
      icon: FiTruck,
    },
    Delivered: {
      label: "Đã giao hàng",
      color: "bg-gray-100 text-black",
      icon: FiCheck,
    },
    Completed: {
      label: "Đã hoàn tất",
      color: "bg-blue-100 text-black",
      icon: FiCheck,
    },
    Returned: {
      label: "Đã trả hàng",
      color: "bg-gray-100 text-black",
      icon: FiCheck,
    },
    Cancelled: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-800",
      icon: FiAlertCircle,
    },
  };
  return configs[status] || configs["Pending Confirmation"];
};

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm ${config.color}`}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
};

const OrderTimeline = ({ status, returnedAt }) => {
  const getFinalStatus = () => {
    if (status === "Cancelled") return "Cancelled";
    if (returnedAt) return "Returned";
    return "Delivered";
  };

  const finalStatus = getFinalStatus();

  // Adjust the order based on the status and returned time
  const steps = [
    { id: "Pending Confirmation", label: "Chờ xác nhận", icon: FiClock },
    { id: "In Transit", label: "Đang vận chuyển", icon: FiTruck },
    returnedAt
      ? {
          id: "Returned",
          label: getStatusConfig("Returned").label,
          icon: getStatusConfig("Returned").icon,
        }
      : {
          id: finalStatus,
          label: getStatusConfig(finalStatus).label,
          icon: getStatusConfig(finalStatus).icon,
        },
  ];

  const currentStep = steps.findIndex(
    (step) => (returnedAt && step.id === "Returned") || step.id === status
  );

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= currentStep;
          const isCompleted = idx < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                ${
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-blue-500"
                    : "bg-gray-100"
                }
                transition-colors duration-200`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="mt-2 text-xs text-center text-gray-600">
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => {
  const [user, setUser] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const token = localStorage.getItem("token");
  const { checkApiResponse } = useAuthWithCheck();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`${API}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        checkApiResponse(response);
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (order) fetchUserInfo();
  }, [API, token, order]);

  if (!order) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  console.log(order);

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-[9999]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleOverlayClick}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Đơn hàng #{order.id}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ngày đặt:{" "}
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Tải PDF"
                >
                  <FiDownload className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {(order.status !== "Cancelled" && order.status !== "Completed") && (
              <OrderTimeline
                status={order.status}
                returnedAt={order.returned_at}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <h4 className="text-base font-semibold">
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Tên:</span>
                    <span>
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Đang tải..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Email:</span>
                    <span>{user ? user.email : "Đang tải..."}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold">Thông tin giao hàng</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-28">Địa chỉ:</span>
                    <span>{order.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 min-w-28">Phương thức:</span>
                    <span>
                      {order.payment_id === 2
                        ? "Thanh toán online ( được giảm 50.000d )"
                        : "Thanh toán khi nhận hàng"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 min-w-28">Ghi chú:</span>
                    <span>{order.note || "Không có"}</span>
                  </div>
                  {order.status === "Cancelled" && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-28">
                        Lý do hủy hàng:
                      </span>
                      <span>{order.cancel_reason || "Không có"}</span>
                    </div>
                  )}
                  {(order.status === "Returned" ||
                    order.return_reason ||
                    order.returned_at) && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-28">
                        Lý do trả hàng:
                      </span>
                      <span>{order.return_reason || "Không có"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-base font-semibold mb-4">
                Chi tiết sản phẩm
              </h4>
              <div className="divide-y border rounded-lg">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-gray-500">Phí vận chuyển:</p>
                <p className="text-gray-900 font-medium">
                  {formatPrice(order.shipping_fee)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tổng cộng:</p>
                <p className="text-gray-900 font-medium">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              <FiX className="h-5 w-5 mr-2" />
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
