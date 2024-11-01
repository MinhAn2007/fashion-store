import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiCheck,
  FiTruck,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";
import { formatPrice } from "../utils/utils";
import { useAuthWithCheck } from "../hooks/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const StatusBadge = ({ status, order }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm ${config.color}`}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    </div>
  );
};

const OrderTimeline = ({ status, returnedAt, statusTimestamps }) => {
  const getFinalStatus = () => {
    if (status === "Cancelled") return "Cancelled";
    if (returnedAt) return "Returned";
    return "Delivered";
  };

  const finalStatus = getFinalStatus();

  const steps = [
    {
      id: returnedAt ? "Returned" : "Pending Confirmation",
      label: getStatusConfig(returnedAt ? "Returned" : "Pending Confirmation")
        .label,
      icon: getStatusConfig(returnedAt ? "Returned" : "Pending Confirmation")
        .icon,
    },
    {
      id: "In Transit",
      label: "Đang vận chuyển",
      icon: FiTruck,
    },
    {
      id: "Delivered",
      label: "Đã giao hàng",
      icon: FiCheck,
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
          const timestamp = statusTimestamps[step.id];

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-blue-500"
                    : "bg-gray-100"
                } transition-colors duration-200`}
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
              {timestamp && (
                <div className="text-xs text-gray-500">
                  {new Date(timestamp).toLocaleString("vi-VN")}
                </div>
              )}
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

  const statusTimestamps = {
    "Pending Confirmation": order.created_at,
    "In Transit": order.shipping_at,
    Delivered: order.delivery_at,
    Completed: order.completed_at,
    Returned: order.returned_at,
    Cancelled: order.cancelled_at,
  };

  const downloadPDF = () => {
    const input = document.getElementById("modal");
  
    // Tạo một div với kích thước A4
    const a4Div = document.createElement('div');
    a4Div.style.width = '210mm'; // Chiều rộng A4
    a4Div.style.height = '297mm'; // Chiều cao A4
    a4Div.style.position = 'absolute';
    a4Div.style.left = '-9999px'; // Ẩn div ra khỏi màn hình
    document.body.appendChild(a4Div);
    
    // Sao chép nội dung từ modal vào div A4
    a4Div.innerHTML = input.innerHTML;
  
    html2canvas(a4Div, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Chiều rộng của ảnh trong mm
      const pageHeight = pdf.internal.pageSize.height; // Chiều cao trang
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Tính chiều cao của ảnh
      let heightLeft = imgHeight;
  
      let position = 0;
  
      if (heightLeft >= pageHeight) {
        position = 0;
        while (heightLeft >= 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
          if (heightLeft >= 0) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }
  
      pdf.save("download.pdf");
      document.body.removeChild(a4Div); 
    });
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-[9999]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div id="modal">
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
                  <StatusBadge status={order.status} order={order} />
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Tải PDF"
                    onClick={() => downloadPDF()}
                  >
                    <FiDownload className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {order.status !== "Cancelled" && order.status !== "Completed" && (
                <OrderTimeline
                  status={order.status}
                  returnedAt={order.returned_at}
                  statusTimestamps={statusTimestamps}
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
                  <h4 className="text-base font-semibold">
                    Thông tin giao hàng
                  </h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-gray-500 min-w-28">Địa chỉ:</span>
                      <span>{order.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-28">
                        Phương thức:
                      </span>
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
                          <p className="text-sm text-gray-500">
                            Size: {item.size} | Màu: {item.color}
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
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
            <button
              type="button"
              className="text-gray-500 hover:bg-gray-200 transition-colors rounded-md px-4 py-2"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
