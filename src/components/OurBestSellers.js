import React from "react";
import { store } from "../productsStore/Store";
import "../styles/OurBestSellers.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux-state/CartState";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthWithCheck } from "../hooks/useAuth";
const OurBestSellers = (props) => {
  const { title, price, id, image } = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthWithCheck();
  const API = process.env.REACT_APP_API_ENDPOINT;
  const { checkApiResponse } = useAuthWithCheck();
  const addItemToCartHandler = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${API}/api/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: id,
          userId: userId,
          quantity: 1,
        }),
      });
      checkApiResponse(response);

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();

      // Update local storage and dispatch custom event for NavBar
      localStorage.setItem("cartQuantity", data.totalQuantity);
      window.dispatchEvent(
        new CustomEvent("cartQuantityUpdated", { detail: data.totalQuantity })
      );

      toast({
        title: "Thành công",
        description: "Đã thêm sản phẩm vào giỏ hàng",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <div
        key={id}
        className="mx-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div className="card w-96 bg-white shadow-xl py-10 ">
          <Link to={`/${id}`}>
            <figure className="pt-6">
              <img
                src={image}
                alt={title}
                className="rounded-xl w-3/5 h-auto"
              />
            </figure>
          </Link>
          <div className="card-body items-center text-center p-2">
            <h2 className="card-title mb-1 font-bold text-xl">{title}</h2>
            <h2 className="text-xl mb-2">{price}</h2>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  addItemToCartHandler();
                }}
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBestSellers;
