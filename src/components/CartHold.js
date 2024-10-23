import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EmptyCart from "./EmptyCart";
import MobileNav from "./MobileNav";
import CartAdditonalFeatures from "./CartAdditonalFeatures";
import BreadCrumb from "./BreadCrumb";
import { MdAdd } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { cartActions } from "../redux-state/CartState";
import { useAuth } from "../hooks/useAuth";

const CartHold = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const  userId = localStorage.getItem("userId");
  const API = process.env.REACT_APP_API_ENDPOINT;
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API}/api/cart/${userId}`); // Sử dụng fetch thay vì axios
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Phân tích dữ liệu JSON

      setCartItems(data.cartItems);
      calculateTotalPrice(data.cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false); // Đặt loading thành false sau khi hoàn tất
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items
      .map((item) => item.quantity * item.skuPrice)
      .reduce((total, singleItemPrice) => total + singleItemPrice, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityUpdate = async (productId, action) => {
    try {
      const response = await fetch(`${API}/api/cart/update-quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Nếu bạn dùng token
        },
        body: JSON.stringify({
          productId,
          action
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating cart');
      }

      const data = await response.json();
      setCartItems(data.cartItems);
      calculateTotalPrice(data.cartItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Thêm xử lý lỗi UI ở đây (ví dụ: hiển thị thông báo)
    }
  };

  // Cập nhật các handlers
  const handleRemoveItemFromCart = (productId) => {
    handleQuantityUpdate(productId, 'decrease');
  };

  const handleAddItemToCart = (item) => {
    handleQuantityUpdate(item.productId, 'increase');
  };


  const handlePayment = (method) => {
    alert(`Thanh toán bằng: ${method}`);
  };

  if (loading) {
    return <p>Loading...</p>; // Hiển thị khi đang tải dữ liệu
  }

  return (
    <div>
      <MobileNav />
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mb-20">
          <div className="mx-48 mt-10">
            <BreadCrumb name="Giỏ Hàng" />
          </div>
          <div className="flex mx-48 mt-10">
            <div className="flex-1 mb-6">
              <p className="text-xl font-semibold mb-6">
                Có {cartItems.length} sản phẩm đang đợi được mua
              </p>
              <div className="grid grid-cols-5 font-semibold text-lg mb-4 pb-2">
                <p>Ảnh</p>
                <p>Sản phẩm</p>
                <p>Giá</p>
                <p>Số lượng</p>
              </div>
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-5 items-center border-gray-300 pb-6"
                >
                  <img
                    src={item.productImage}
                    alt={item.sku}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <p className="font-semibold text-lg">{item.productName}</p>
                  <p className="text-lg">
                    {item.skuPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <div className="flex">
                    <RiSubtractFill
                      className="text-3xl text-black cursor-pointer mx-2"
                      onClick={() => handleRemoveItemFromCart(item.productId)}
                    />
                    <span className="text-2xl">{item.quantity}</span>
                    <MdAdd
                      className="text-3xl text-black cursor-pointer mx-2"
                      onClick={() => handleAddItemToCart(item)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary Section */}
            <div className="shadow-lg bg-white border border-gray-200 w-72 h-fit rounded-lg p-4 ml-4">
              <div className="flex justify-between text-2xl font-semibold mt-8">
                <p>Tạm tính</p>
                <p>
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="flex justify-between mt-10 font-medium text-xl">
                <p>Phí ship</p>
                <p>$20</p>
              </div>
              <div className="flex justify-between mt-10 font-medium text-xl">
                <p>Thuế</p>
                <p>$15</p>
              </div>
              <div className="my-4 border-t border-gray-300" />
              <div className="flex justify-between font-medium text-xl">
                <p>Total:</p>
                <p>
                  {(totalPrice + 20 + 15).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="my-4 border-t border-gray-300" />
              <div className="text-center my-6">
                <button className="bg-black w-full text-white h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black">
                  Thanh Toán
                </button>
                <CartAdditonalFeatures handlePayment={handlePayment} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartHold;
