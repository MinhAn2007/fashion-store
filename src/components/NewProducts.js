import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiShoppingTag as TagIcon } from "react-icons/ci";
import { Loader } from "rizzui";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthWithCheck } from "../hooks/useAuth";
import { formatPrice } from "../utils/utils";

const NewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const { isAuthenticated } = useAuthWithCheck();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchNewProducts = async () => {
    try {
      const response = await fetch(`${API}/api/newProducts`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching new products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCartHandler = async (product) => {
    if (!isAuthenticated) {
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
    fetchNewProducts();
  }, [API]);

  if (loading) {
    return (
      <div className="flex justify-center mx-auto min-h-[700px] bg-white">
        <Loader
          size="md"
          width={200}
          height={200}
          className="text-center my-40 text-black"
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-white text-black">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-black rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
              <TagIcon className="mr-3 w-10 h-10 text-black" />
              SẢN PHẨM MỚI VỀ
            </h1>
            <p className="text-xl mb-4">
              Khám phá những xu hướng mới nhất với bộ sưu tập mới của chúng tôi!
            </p>
            <p className="text-sm opacity-70">
              Số lượng có hạn - Đừng bỏ lỡ!
            </p>
          </div>
          <div className="bg-black/10 p-4 rounded-full border border-black">
            <h2 className="text-2xl font-extrabold text-black">Mới Nhất</h2>
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 content-center">
        {products.map((item) => (
          <div
            key={item.id}
            className="mx-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
          >
            <div className="absolute top-5 left-5 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              Mới
            </div>
            <div className="card text-black shadow-xl py-10 border border-gray-200 rounded-xl">
              <Link to={`/${item.id}`}>
                <figure className="pt-6">
                  <img
                    src={item.skus[0].image}
                    alt={item.name}
                    className="rounded-xl w-3/5 h-auto brightness-90 hover:brightness-100 transition-all duration-300"
                  />
                </figure>
              </Link>
              <div className="card-body items-center text-center p-2">
                <h2 className="card-title mb-1 font-bold text-xl">{item.name}</h2>
                <h2 className="text-xl mb-2 font-semibold">{formatPrice(item.skus[0].price)}</h2>
                <div className="card-actions">
                  <button
                    className="btn btn-outline btn-black text-black hover:bg-black hover:text-white"
                    onClick={() => addItemToCartHandler(item)}
                  >
                    Thêm Vào Giỏ
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

export default NewProductsPage;