import React from "react";
import { useSelector, useDispatch } from "react-redux";
import EmptyCart from "./EmptyCart";
import MobileNav from "./MobileNav";
import CartAdditonalFeatures from "./CartAdditonalFeatures";
import BreadCrumb from "./BreadCrumb";
import { MdAdd } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import { cartActions } from "../redux-state/CartState";

const CartHold = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartLen = cartItems.length;

  const totalPrice = cartItems
    .map((item) => item.quantity * item.price)
    .reduce((total, singleItemPrice) => total + singleItemPrice, 0);
  const dispatch = useDispatch();

  const removeItemFromCartHandler = (id) => {
    dispatch(cartActions.removeItemFromCart(id));
  };

  const addItemToCartHandler = (item) => {
    dispatch(cartActions.addItemToCart(item));
  };

  const handlePayment = (method) => {
    alert(`Thanh toán bằng: ${method}`);
  };

  return (
    <div>
      <MobileNav />
      {cartLen === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mb-20">
          <div className="mx-48 mt-10">
            <BreadCrumb name="Giỏ Hàng" />
          </div>
          <div className="flex mx-48 mt-10">
            <div className="flex-1 mb-6">
              <p className="text-xl font-semibold mb-6">
                Có {cartLen} sản phẩm đang đợi được mua
              </p>
              <div className="grid grid-cols-5 font-semibold text-lg mb-4 pb-2">
                <p>Ảnh</p>
                <p>Sản phẩm</p>
                <p>Giá</p>
                <p>Số lượng</p>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-5 items-center border-gray-300 pb-6">
                  <img
                    src={item.picture}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-lg">${item.price}</p>
                  <div className="flex items-center justify-center">
                    <RiSubtractFill
                      className="text-3xl text-black cursor-pointer mx-2"
                      onClick={() => removeItemFromCartHandler(item.id)}
                    />
                    <span className="text-2xl">{item.quantity}</span>
                    <MdAdd
                      className="text-3xl text-black cursor-pointer mx-2"
                      onClick={() => addItemToCartHandler(item)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary Section */}
            <div className="shadow-lg bg-white border border-gray-200 w-72 h-fit rounded-lg p-4 ml-4">
              <div className="flex justify-between text-2xl font-semibold mt-8">
                <p>Tạm tính</p>
                <p>${Math.round(totalPrice)}</p>
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
                <p>${Math.round(totalPrice + 20 + 15)}</p>
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
