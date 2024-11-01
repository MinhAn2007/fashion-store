import React, { useEffect } from "react";
import fashionImg3 from "../assets/banner1.png";
import { formatPrice } from "../utils/utils.js";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthWithCheck } from "../hooks/useAuth";

const MinimalFashion = () => {
  const features = [
    "Thiết kế đơn giản, thanh lịch",
    "Chất liệu cao cấp bền đẹp",
    "Màu sắc trung tính dễ phối",
    "Đường may tỉ mỉ, chắc chắn",
    "Kiểu dáng basic phù hợp mọi dịp",
  ];

  const [products, setProducts] = React.useState([]);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const { isAuthenticated, checkApiResponse } = useAuthWithCheck();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API}/api/getByCollection/Minimalism`);
      const data = await response.json();
      console.log(data);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [API]);

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
        checkApiResponse(response);

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl w-full px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 tracking-tight">
            Thời Trang Tối Giản
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Thời trang tối giản là xu hướng thời trang hiện đại, tập trung vào
            những thiết kế đơn giản nhưng tinh tế. Phong cách này đề cao sự
            thanh lịch và bền vững, giúp bạn xây dựng tủ đồ capsule hoàn hảo
            với những item basic dễ dàng mix & match.
          </p>
        </div>

        {/* Image Section */}
        <div className="relative w-full mb-16">
          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={fashionImg3}
              alt="Minimal fashion style"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Đặc điểm nổi bật
            </h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className="text-lg text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Màu sắc và Chất liệu
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Thời trang tối giản thường sử dụng các gam màu trung tính như đen,
              trắng, be và xám. Chất liệu được chọn lọc kỹ càng như cotton organic,
              linen, len merino với form dáng basic nhưng vẫn đảm bảo phom dáng
              đẹp và thoải mái khi mặc.
            </p>
            <div className="flex space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-900"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full bg-white border"></div>
              <div className="w-10 h-10 rounded-full bg-amber-100"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 col-span-full text-center">
            Bộ sưu tập thời trang tối giản
          </h3>
          {products.map((item) => (
            <div
              key={item.id}
              className="mx-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg relative"
            >
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
                  <h2 className="card-title mb-1 font-bold text-xl">
                    {item.name}
                  </h2>
                  <h2 className="text-xl mb-2 font-semibold">
                    {formatPrice(item.skus[0].price)}
                  </h2>
                  <div className="card-actions">
                    <button
                      className="btn btn-outline bg-black text-white hover:bg-opacity-30 hover:text-white"
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
    </div>
  );
};

export default MinimalFashion;