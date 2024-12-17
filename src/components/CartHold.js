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
  Checkbox,
} from "@chakra-ui/react";
import EmptyCart from "./EmptyCart";
import MobileNav from "./MobileNav";
import BreadCrumb from "./BreadCrumb";
import { useAuthWithCheck } from "../hooks/useAuth";
import { Button } from "rizzui";
import { formatPrice } from "../utils/utils.js"; // Import formatPrice from utils
import { Link } from "react-router-dom";
import { Loader } from "rizzui";

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
      const cartItemsWithChecked = data.cartItems.map((item) => ({
        ...item,
        checked: item.isInStock,
      }));
      setCartItems(cartItemsWithChecked);
      calculateTotalPrice(cartItemsWithChecked);
      updateCartQuantity(data.totalQuantity);
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
    const total = items
      .filter((item) => item.checked)
      .reduce((sum, item) => sum + item.quantity * item.skuPrice, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  const updateCartQuantity = (quantity) => {
    localStorage.setItem("cartQuantity", quantity);
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
      const updatedItems = data.cartItems.map((item) => ({
        ...item,
        checked:
          cartItems.find((cartItem) => cartItem.id === item.id)?.checked ??
          true,
      }));
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
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
    if (item.isInStock === false && increment === 1) return;
    const newQuantity = item.quantity + increment;
    if (newQuantity === 0) {
      setSelectedItem(item);
      setIsOpen(true);
      return;
    }

    setPreviousQuantity((prev) => ({
      ...prev,
      [item.id]: item.quantity,
    }));

    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );

    updateCartQuantity(
      updatedItems
        .filter((cartItem) => cartItem.isInStock === true)
        .reduce((total, item) => total + item.quantity, 0)
    );

    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      handleQuantityUpdate(item.id, newQuantity);
    }, 3000);

    setTimeoutId(id);
  };
  const handleToggleSelectItem = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
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
        body: JSON.stringify({ productId: selectedItem.id, userId }),
      });

      if (!response.ok) throw new Error("Error removing item");
      const data = await response.json();
      const updatedItems = data.updatedCartItems.cartItems.map((item) => ({
        ...item,
        checked: true,
      }));
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
      updateCartQuantity(data.updatedCartItems.totalQuantity);

      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
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

  return (
    <div className="min-h-[650px]">
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

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr] items-center border-b border-gray-300 p-6 mb-4 bg-white"
                >
                  <Checkbox
                    isChecked={item.checked}
                    onChange={() => handleToggleSelectItem(item.id)}
                    colorScheme="blackAlpha"
                    isDisabled={!item.isInStock}
                  />
                  <Link to={`/${item.productId}`} key={item.id}>
                    <img
                      src={item.productImage}
                      alt={item.sku}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </Link>
                  <div>
                    <p className="font-semibold text-lg">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Màu sắc: {item.color} | Kích thước: {item.size}
                    </p>
                  </div>
                  <p className="text-lg">{formatPrice(item.skuPrice)}</p>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <RiSubtractFill
                        className={`text-3xl cursor-pointer mx-2
                       
                           
                           "text-black
                        }`}
                        onClick={() => handleChangeQuantity(item, -1)}
                      />
                      <span className="text-2xl">{item.quantity}</span>
                      <MdAdd
                        className={`text-3xl mx-2 
                         ${
                           item.isInStock ? "cursor-pointer" : "text-gray-300"
                         }`}
                        onClick={() => handleChangeQuantity(item, 1)}
                      />
                    </div>
                    {!item.isInStock && (
                      <span className="text-red-500 text-sm">Hết hàng</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center my-auto">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsOpen(true);
                      }}
                      className="mb-2 bg-black w-40 text-md text-white hover:bg-opacity-30"
                    >
                      Xóa
                    </Button>
                    <Link to={`/${item.productId}`} key={item.id}>
                      <Button size="sm text-md">Xem chi tiết</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="shadow-lg bg-white border border-gray-200 w-72 h-fit rounded-lg p-4 ml-4 mt-[3.1rem]">
              <div className="flex justify-between text-lg font-semibold mt-8">
                <p>Tạm Tính: </p>
                <p>
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <hr className="my-4" />
              <Link
                to={{
                  pathname: "/order",
                  state: { cartItems, totalPrice },
                }}
                state={{
                  cartItems: cartItems.filter((item) => item.checked),
                  totalPrice,
                }}
              >
                <button className="bg-black text-white py-2 px-4 mt-2 w-full rounded">
                  Thanh toán
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog for Item Removal */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={null}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa sản phẩm
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleCancelRemove}>Hủy</Button>
              <Button
                className="bg-black text-white hover:bg-opacity-30"
                onClick={handleRemoveItem}
                ml={3}
              >
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default CartHold;
