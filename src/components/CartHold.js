import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import {
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import EmptyCart from "./EmptyCart";
import MobileNav from "./MobileNav";
import BreadCrumb from "./BreadCrumb";
import { useAuthWithCheck } from "../hooks/useAuth";

const CartHold = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [previousQuantity, setPreviousQuantity] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const userId = localStorage.getItem("userId");
  const API = process.env.REACT_APP_API_ENDPOINT;
  const toast = useToast();
  const [timeoutId, setTimeoutId] = useState(null);
  const { checkApiResponse } = useAuthWithCheck();

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API}/api/cart/${userId}`);
      checkApiResponse(response);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCartItems(data.cartItems);
      calculateTotalPrice(data.cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải sản phẩm trong giỏ hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.skuPrice,
      0
    );
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  const updateCartQuantity = (quantity) => {
    localStorage.setItem("cartQuantity", quantity);
    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent("cartQuantityUpdated", { detail: quantity })
    );
  };
  const handleQuantityUpdate = async (productId, newQuantity) => {
    try {
      const response = await fetch(`${API}/api/cart/update-quantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity, userId }),
      });
      checkApiResponse(response);

      if (!response.ok) throw new Error("Error updating quantity");
      const data = await response.json();
      setCartItems(data.cartItems);
      calculateTotalPrice(data.cartItems);
      console.log("cartItems", data.totalQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật số lượng sản phẩm.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: previousQuantity[item.productId] }
            : item
        )
      );
      calculateTotalPrice(cartItems);
    }
  };

  const handleChangeQuantity = (item, increment) => {
    const newQuantity = item.quantity + increment;

    if (newQuantity === 0) {
      setSelectedItem(item);
      setIsOpen(true);
      return;
    }

    setPreviousQuantity((prev) => ({
      ...prev,
      [item.productId]: item.quantity,
    }));

    const updatedItems = cartItems.map((cartItem) =>
      cartItem.productId === item.productId
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );
    updateCartQuantity(newQuantity);

    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      handleQuantityUpdate(item.productId, newQuantity);
    }, 3000);

    setTimeoutId(id);
  };

  const handleRemoveItem = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`${API}/api/cart/remove-item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId: selectedItem.productId, userId }),
      });

      if (!response.ok) throw new Error("Error removing item");
      const data = await response.json();
      setCartItems(data.updatedCartItems.cartItems);
      calculateTotalPrice(data.updatedCartItems.cartItems);
      updateCartQuantity(data.updatedCartItems.totalQuantity);
      console.log("cartItems", localStorage.getItem("cartQuantity"));

      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);

      console.error("Error removing item:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsOpen(false);
      setSelectedItem(null);
    }
  };

  const handleCancelRemove = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  const handlePayment = (method) => {
    alert(`Thanh toán bằng: ${method}`);
  };

  if (loading) return <p>Loading...</p>;

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
                  <div>
                    <p className="font-semibold text-lg">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Màu sắc: {item.color} | Kích thước: {item.size}
                    </p>
                  </div>
                  <p className="text-lg">
                    {item.skuPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <div className="flex">
                    <RiSubtractFill
                      className="text-3xl text-black cursor-pointer mx-2"
                      onClick={() => handleChangeQuantity(item, -1)}
                    />
                    <span className="text-2xl">{item.quantity}</span>
                    <MdAdd
                      className="text-3xl text-black cursor-pointer mx-2"
                      onClick={() => handleChangeQuantity(item, 1)}
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
              <button
                onClick={() => handlePayment("MOMO")}
                className="bg-black text-white py-2 px-4 rounded mt-4 w-full"
              >
                Thanh toán Online
              </button>
              <button
                onClick={() => handlePayment("Thẻ tín dụng")}
                className="bg-black text-white py-2 px-4 rounded mt-4 w-full"
              >
                Thanh toán khi nhận hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog for Remove Item */}
      <AlertDialog isOpen={isOpen} onClose={handleCancelRemove}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Xác nhận xóa</AlertDialogHeader>
          <AlertDialogBody>
            Bạn có chắc chắn muốn xóa sản phẩm {selectedItem?.productName}?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="bg-white text-black"
              onClick={handleCancelRemove}
            >
              Hủy
            </Button>
            <Button
              backgroundColor={"black"}
              textColor={"white"}
              className="bg-black text-white"
              onClick={handleRemoveItem}
              ml={3}
            >
              Xóa
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CartHold;
