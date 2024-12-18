import React from 'react';
import { Button, Text } from "rizzui";
import { formatPrice } from "../utils/utils.js";

const OrderConfirmationModal = ({
  isOpen, 
  onClose, 
  onConfirm, 
  orderDetails
}) => {
  if (!isOpen) return null;

  const {
    selectedAddress, 
    paymentMethod, 
    cartItems, 
    subtotal, 
    totalAmount, 
    appliedCoupon,
    shippingFee
  } = orderDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Xác nhận đơn hàng</h2>
        
        {/* Shipping Address */}
        <div className="mb-4 border-b pb-4">
          <h3 className="font-semibold mb-2">Địa chỉ giao hàng</h3>
          <p>{selectedAddress.label}</p>
        </div>

        {/* Payment Method */}
        <div className="mb-4 border-b pb-4">
          <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
          <p>{paymentMethod.label}</p>
        </div>

        {/* Order Items */}
        <div className="mb-4 border-b pb-4">
          <h3 className="font-semibold mb-2">Sản phẩm</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <div>
                <p>{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity} ({item.size}, {item.color})
                </p>
              </div>
              <p>{formatPrice(item.skuPrice * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Cost Breakdown */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <Text>Tạm tính</Text>
            <Text>{formatPrice(subtotal)}</Text>
          </div>
          <div className="flex justify-between mb-2">
            <Text>Phí vận chuyển</Text>
            <Text>{formatPrice(shippingFee)}</Text>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between mb-2 text-green-600">
              <Text>
                Giảm giá (
                {appliedCoupon.coupon_type === "percent"
                  ? `${appliedCoupon.coupon_value}%`
                  : formatPrice(appliedCoupon.coupon_value)}
                )
              </Text>
              <Text>
                -{formatPrice(
                  appliedCoupon.coupon_type === "percent"
                    ? (subtotal * parseFloat(appliedCoupon.coupon_value)) / 100
                    : parseFloat(appliedCoupon.coupon_value)
                )}
              </Text>
            </div>
          )}
          <div className="flex justify-between font-bold mt-4">
            <Text>Tổng cộng</Text>
            <Text className="text-red-600">{formatPrice(totalAmount)}</Text>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            className="mr-4" 
            onClick={onClose}
          >
            Quay lại
          </Button>
          <Button 
            className="bg-black text-white hover:bg-opacity-80"
            onClick={onConfirm}
          >
            Xác nhận đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;