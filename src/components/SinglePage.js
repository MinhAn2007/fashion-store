import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux-state/CartState";
import BreadCrumb from "./BreadCrumb";
import { AiFillStar } from "react-icons/ai";
import { FaShippingFast, FaLock } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { useToast } from "@chakra-ui/react";

const SinglePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API}/api/product/${id}`);
        const data = await response.json();
        setProduct(data);
        if (data.images) {
          setActiveImg(data.images.split(",")[0]); // Set the first image as the default
        }
        setSelectedVariant(data.skus[0]); // Set the default variant
        setSelectedSize(data.skus[0].size); // Set the default size
        setSelectedColor(data.skus[0].color); // Set the default color
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const addItemToCartHandler = () => {
    if (selectedVariant) {
      dispatch(
        cartActions.addItemToCart({
          id,
          price: selectedVariant.price,
          title: product.name,
          image: activeImg,
        })
      );
      toast({
        title: "Success",
        description: "Successfully Added to Cart",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(variant.size);
    setSelectedColor(variant.color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const variant = product.skus.find(
      (v) => v.size === size && v.color === selectedColor
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const variant = product.skus.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <div className="relative p-4 gap-36 mx-96 flex">
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
                    className="w-24 h-36 cursor-pointer object-cover rounded-md mb-2"
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
        <div className="flex flex-col w-1/2 ml-8">
          <div className="flex flex-col gap-4">
            <BreadCrumb name={product.name} />
            <p className="font-semibold text-xl">{product.name}</p>
            <p className="text-xl">
              ${selectedVariant ? selectedVariant.price : product.skus[0].price}
            </p>
            <p>
              {selectedVariant
                ? `Size: ${selectedVariant.size}, Color: ${selectedVariant.color}`
                : ""}
            </p>
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
              <p className="font-semibold">{product.reviews.length} reviews</p>
            </div>
            <div className="mt-4">
              <button
                className="bg-black w-52 text-white h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black"
                onClick={addItemToCartHandler}
              >
                ADD TO CART
              </button>
            </div>

            {/* Display product sizes */}
            <div className="mt-4">
              <p className="font-semibold">Sizes:</p>
              {/* Lấy các kích thước duy nhất từ danh sách biến thể */}
              {Array.from(
                new Set(product.skus.map((variant) => variant.size))
              ).map((size) => (
                <button
                  key={size}
                  className={`border border-gray-300 rounded p-2 mr-2 hover:bg-gray-200 ${
                    size === selectedSize ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSizeChange(size)}
                  disabled={product.skus.every(
                    (variant) => variant.size === size && variant.quantity === 0
                  )} // Disable if out of stock
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Display product colors */}
            <div className="mt-4">
              <p className="font-semibold">Colors:</p>
              {product.skus.map((variant) => (
                <button
                  key={variant.id}
                  className={`w-8 h-8 rounded-full mr-2 ${
                    variant.color === selectedColor
                      ? "border-2 border-black"
                      : ""
                  }`}
                  style={{
                    backgroundColor: variant.color,
                    opacity: variant.quantity === 0 ? 0.5 : 1, // Reduce opacity if out of stock
                  }}
                  onClick={() => handleColorChange(variant.color)}
                  disabled={variant.quantity === 0} // Disable if out of stock
                />
              ))}
            </div>
          </div>

          {/* Display reviews */}
        </div>
      </div>
      <div className="mt-4 ml-96">
        {product.reviews.map((review) => (
          <div key={review.id} className="border-b py-2">
            <div className="flex items-center">
              {Array.from({ length: review.rating }, (_, index) => (
                <AiFillStar key={index} className="text-yellow-500" />
              ))}
              <p className="ml-2 font-semibold">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SinglePage;
