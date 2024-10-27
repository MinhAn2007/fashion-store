import React from "react";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng #{order.id}</h2>
        <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.created_at).toLocaleDateString()}</p>
        <div className="space-y-2 mt-4">
          {order.items.map((item) => (
            <div key={item.id} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-medium">{item.quantity}x</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-900">
            Tổng cộng: {(order.total + order.shipping_fee).toLocaleString("vi-VN")} ₫
          </p>
        </div>
        <button
          className="mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-blue-500 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 transition-colors"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
