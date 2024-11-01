import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import BreadCrumb from "./BreadCrumb";
import { useAuthWithCheck } from "../hooks/useAuth";
import { formatPrice } from "../utils/utils";
import { Loader } from "rizzui";

const colorMap = {
  Đỏ: "#FF0000",
  Xanh: "#0000FF",
  Đen: "#000000",
  Trắng: "#FFFFFF",
  Vàng: "#FFFF00",
  Xám: "#808080",
};

const SinglePage = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState("");

  const { isAuthenticated, checkApiResponse } = useAuthWithCheck();
  const openOverlay = (media) => {
    setSelectedMedia(media);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setSelectedMedia("");
    setIsOverlayOpen(false);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API}/api/product/${id}`);
        const data = await response.json();
        setProduct(data);

        if (data.images) {
          setActiveImg(data.images.split(",")[0]); // Set ảnh đầu tiên làm ảnh mặc định
        }
        setSelectedVariant(data.skus[0]); // Đặt biến thể mặc định
        setSelectedSize(data.skus[0].size); // Đặt kích thước mặc định
        setSelectedColor(data.skus[0].color); // Đặt màu mặc định
        setProduct({ ...data, id: data.skus[0].id }); // Cập nhật ID sản phẩm
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

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
          productId: product.id,
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

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    const availableVariants = product.skus.filter((v) => v.size === size);

    const currentColorAvailable = availableVariants.some(
      (v) => v.color === selectedColor
    );

    if (!currentColorAvailable && availableVariants.length > 0) {
      setSelectedColor(availableVariants[0].color);
      setSelectedVariant(availableVariants[0]);
      setProduct({ ...product, id: availableVariants[0].id }); // Cập nhật ID sản phẩm
    } else {
      const variant = availableVariants.find((v) => v.color === selectedColor);
      if (variant) {
        setSelectedVariant(variant);
        setProduct({ ...product, id: variant.id }); // Cập nhật ID sản phẩm
      }
    }
  };

  const handleColorChange = (color) => {
    const variant = product.skus.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) {
      setSelectedColor(color);
      setSelectedVariant(variant);
      setProduct({ ...product, id: variant.id }); // Cập nhật ID sản phẩm
    }
  };

  if (!product)
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

  const availableColors = Array.from(
    new Set(
      product.skus
        .filter((v) => v.size === selectedSize && v.quantity > 0)
        .map((variant) => variant.color)
    )
  );

  return (
    <>
      <div className="my-10 ml-96 pl-4">
        <BreadCrumb name={product.name} />
      </div>
      <div className="relative p-4 gap-6 mx-96 flex">
        <div className="flex flex-col items-start">
          <div className="flex flex-row mb-4">
            <div className="flex flex-col">
              {product.images
                .split(",")
                .slice(0, 3)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Product Image ${index + 1}`}
                    className="w-44 h-44 cursor-pointer object-cover rounded-md mb-2"
                    onMouseEnter={() => setActiveImg(img)}
                    onMouseLeave={() =>
                      setActiveImg(product.images.split(",")[0])
                    }
                  />
                ))}
            </div>
            <figure className="ml-6 mb-4 w-auto">
              <img
                src={activeImg}
                alt="Product"
                className="rounded-2xl w-96 h-full object-cover"
              />
            </figure>
          </div>
        </div>
        {/* Right side: product details */}
        <div className="flex flex-col w-full md:w-1/2 ml-8">
          <p className="text-md mb-4">
            <span className="font-bold">Tên sản phẩm: </span>
            {product.name}
          </p>
          <p className="text-md mb-4">
            <span className="font-bold">Mô tả sản phẩm: </span>
            {product.description}
          </p>
          <p className="text-md mb-4">
            <span className="font-bold">Số lượng đã bán: </span>
            {product.sold}
          </p>{" "}
          <p className="text-md mb-4">
            <span className="font-bold">Danh mục: </span>
            {product.category_name}
          </p>{" "}
          <div className="flex flex-col gap-4">
            <p className="text-md font-bold">
              Giá: {""}
              {formatPrice(
                selectedVariant ? selectedVariant.price : product.skus[0].price
              )}
            </p>

            <p>
              {selectedVariant
                ? `Size: ${selectedVariant.size}, Color: ${selectedVariant.color}`
                : `Size: ${selectedSize}, Color: ${selectedColor}`}
            </p>

            {/* Hiển thị đánh giá */}
            <div className="flex items-center gap-2 mt-2">
              {Array.from(
                {
                  length:
                    product.reviews.length > 0 ? product.reviews[0].rating : 5,
                },
                (_, index) => (
                  <AiFillStar key={index} className="text-yellow-500" />
                )
              )}
              <p className="font-semibold">{product.reviews.length} đánh giá</p>
            </div>

            {/* Thêm sản phẩm vào giỏ hàng */}
            <div className="mt-2">
              <button
                className="bg-black w-full md:w-52 text-white h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black"
                onClick={addItemToCartHandler}
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>

            {/* Hiển thị kích thước */}
            <div className="mt-2">
              <p className="font-semibold mb-2">Kích cỡ:</p>
              <div className="flex flex-wrap">
                {Array.from(
                  new Set(product.skus.map((variant) => variant.size))
                ).map((size) => (
                  <button
                    key={size}
                    className={`border border-gray-300 rounded p-2 mr-2 mb-2 hover:bg-gray-200 ${
                      size === selectedSize ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSizeChange(size)}
                    disabled={product.skus.every(
                      (variant) =>
                        variant.size === size && variant.quantity === 0
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Hiển thị màu sắc */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Màu sắc:</p>
              <div className="flex flex-wrap">
                {availableColors.map((color) => {
                  const variantForColor = product.skus.find(
                    (v) => v.color === color && v.size === selectedSize
                  );
                  const isDisabled =
                    !variantForColor || variantForColor.quantity === 0;
                  const isSelected = color === selectedColor;

                  // Determine text color based on background color
                  const isLightColor =
                    colorMap[color] === "#FFFFFF" ||
                    colorMap[color] === "#FFFF00" ||
                    colorMap[color] === "#FFD700"; // Add other light colors as needed
                  const textColor = isLightColor ? "black" : "white";

                  return (
                    <div
                      key={color}
                      className="relative inline-block mr-2 mb-2"
                    >
                      <button
                        className={`w-8 h-8 rounded-full border-2 ${
                          isSelected ? "border-gray-500" : "border-black"
                        }`}
                        style={{
                          backgroundColor: colorMap[color],
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                        onClick={() => handleColorChange(color)}
                        disabled={isDisabled}
                      />
                      {isSelected && (
                        <span
                          className={`absolute top-0 left-0 w-full h-full flex justify-center items-center ${textColor}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 ${textColor}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            color={textColor}
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 mx-96">
        <h2 className="text-lg font-bold mb-4">Đánh giá của khách hàng:</h2>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <p className="font-semibold">{review.title}</p>
              <div className="flex items-center">
                {Array.from({ length: review.rating }, (_, idx) => (
                  <AiFillStar key={idx} className="text-yellow-500" />
                ))}
              </div>
              <p>{review.content}</p>
              <div className="flex mt-2">
                {/* Hiển thị hình ảnh */}
                {review.images &&
                  review.images.length > 0 &&
                  review.images.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={image}
                      alt={`Review image ${imgIndex + 1}`}
                      className="w-16 h-16 object-cover mr-2 cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => openOverlay(image)} // Mở overlay cho hình ảnh
                    />
                  ))}

                {/* Hiển thị video dưới dạng hình ảnh */}
                {review.video &&
                  review.video.length > 0 &&
                  review.video.map((videoUrl, vidIndex) => (
                    <img
                      key={vidIndex}
                      src="https://img.icons8.com/ios-filled/50/000000/video.png" // Hình ảnh biểu tượng video
                      alt={`Review video ${vidIndex + 1}`}
                      className="w-16 h-16 object-cover mr-2 cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => openOverlay(videoUrl)} // Mở overlay cho video
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            Hiện tại chưa có đánh giá cho sản phẩm.
          </p>
        )}

        {/* Overlay để hiển thị hình ảnh hoặc video */}
        {isOverlayOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[99999]">
            {selectedMedia.endsWith(".mp4") ? ( // Kiểm tra định dạng media
              <video
                src={selectedMedia}
                className="max-w-full max-h-full"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Selected review"
                className="max-w-full max-h-full"
              />
            )}
            <button
              onClick={closeOverlay}
              className="absolute top-4 right-4 text-white text-lg"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SinglePage;
