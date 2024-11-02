import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiShoppingTag as TagIcon } from "react-icons/ci";
import { Loader } from "rizzui";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthWithCheck } from "../hooks/useAuth";
import SaleCountdown from "./SaleCountDown";
import { formatPrice } from "../utils/utils";

const SaleProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const { isAuthenticated } = useAuthWithCheck();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProductsSale = async () => {
    try {
      const response = await fetch(`${API}/api/getByPrice/199000/199000`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCartHandler = async (product) => {
    if (!isAuthenticated) {
      localStorage.setItem("redirect", location.pathname);
      navigate("/login", { state: { from: location } });
      return;
    }

    if (product.skus.length > 0) {
      const selectedVariant = product.skus[0];

      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`${API}/api/cart/add-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: selectedVariant.id,
            userId: userId,
            quantity: 1,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }

        const data = await response.json();
        localStorage.setItem("cartQuantity", data.totalQuantity);
        window.dispatchEvent(
          new CustomEvent("cartQuantityUpdated", { detail: data.totalQuantity })
        );

        toast({
          title: "Thành công",
          description: "Sản phẩm đã được thêm vào giỏ hàng",
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
    }
  };

  useEffect(() => {
    fetchProductsSale();
  }, [API]);

  if (loading) {
    return (
      <div className="flex justify-center mx-auto min-h-[700px] bg-black">
        <Loader
          size="md"
          width={200}
          height={200}
          className="text-center my-40 text-white"
        />
      </div>
    );
  }

  return (
    <div className=" px-4 py-8 bg-black text-white">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 mb-8 shadow-lg border border-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
              <TagIcon className="mr-3 w-10 h-10 text-white" />
              ĐỒNG GIÁ 199K - SALE KHỦNG
            </h1>
            <p className="text-xl mb-4">
              Cơ hội vàng để sở hữu những items hot nhất với mức giá cực ưu đãi!
            </p>
            <p className="text-sm opacity-80">
              Số lượng có hạn - Nhanh tay kẻo lỡ!
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-full border border-white">
            <h2 className="text-2xl font-extrabold text-white">Chỉ còn 199K</h2>
          </div>
        </div>
      </div>
      <SaleCountdown />
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="mx-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-gray-900 to-gray-800"
          >
            <div className="absolute top-5 left-5 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              Giảm giá
            </div>
            <div className="card text-white shadow-xl py-10 border border-white">
              <Link to={`/${item.id}`}>
                <figure className="pt-6">
                  <img
                    src={item.skus[0].image}
                    alt={item.name}
                    className="rounded-xl w-3/5 h-auto grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </figure>
              </Link>
              <div className="card-body items-center text-center p-2">
                <h2 className="card-title mb-1 font-bold text-xl">
                  {item.name}
                </h2>
                <h2 className="text-xl mb-2">
                  {formatPrice(item.skus[0].price)}
                </h2>
                <div className="card-actions">
                  <button
                    className="btn btn-outline btn-white text-white hover:bg-white hover:text-black"
                    onClick={() => addItemToCartHandler(item)}
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleProductsPage;
