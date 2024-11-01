"use client";

import React, { useState, useEffect } from "react";
import BreadCrumb from "./BreadCrumb";
import "../styles/SinglePage.css";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthWithCheck } from "../hooks/useAuth";
import { formatPrice } from "../utils/utils";

const filters = [
  {
    name: "Giá",
    value: "price",
    options: ["Dưới 100.000đ", "100.000đ - 200.000đ", "Trên 200.000đ"],
    type: "checkbox",
  },
  {
    name: "Màu sắc",
    value: "color",
    options: ["Đỏ", "Vàng", "Xanh", "Đen", "Trắng"],
    type: "checkbox",
  },
  {
    name: "Kích cỡ",
    value: "size",
    options: ["S", "M", "L", "XL"],
    type: "checkbox",
  },
  {
    name: "Đánh giá",
    value: "rating",
    options: ["1 sao", "2 sao", "3 sao", "4 sao", "5 sao"],
    type: "checkbox",
  },
  {
    name: "Danh mục",
    value: "category",
    options: ["Áo", "Quần", "Phụ kiện", "Giày"],
    type: "checkbox",
  },
];
const mapProductType = (id) => {
  const productTypes = {
    1: "Áo",
    2: "Quần",
    3: "Phụ kiện",
    4: "Giày dép",
    5: "Áo khoác",
    6: "Giày sneaker",
    7: "Áo thun",
    8: "Quần jean",
    9: "Túi xách",
    10: "Nón",
    11: "Áo sơ mi",
    12: "Polo",
    13: "Quần vải",
    14: "Quần tây",
    15: "Chân váy",
    16: "Vòng cổ",
    17: "Lắc tay",
    18: "Khuyên tai",
    19: "Giày cao gót",
    20: "Giày thể thao",
  };
  return productTypes[id] || "Tất cả sản phẩm";
};
let nameBreadCrumb = "Tất cả sản phẩm";
export default function ShopPage(props) {
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    color: [],
    size: [],
    category: [],
    rating: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [allProducts, setAllProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const { isAuthenticated } = useAuthWithCheck();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { checkApiResponse } = useAuthWithCheck();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (props.id) {
          response = await fetch(`${API}/api/category/${props.id}`);
          nameBreadCrumb = mapProductType(props.id);
        } else {
          response = await fetch(`${API}/api/products`);
          nameBreadCrumb = "Tất cả sản phẩm";
        }

        const data = await response.json();
        setAllProducts(data.products || []);
        setSortedProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [API, props.id]);

  useEffect(() => {
    filterProducts();
  }, [selectedFilters]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortProducts = (order) => {
    const sorted = [...sortedProducts].sort((a, b) => {
      const priceA = parseInt(a.skus[0].price);
      const priceB = parseInt(b.skus[0].price);
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
    setSortedProducts(sorted);
  };

  const filterProducts = () => {
    let filteredProducts = allProducts;

    // Lọc theo giá
    if (selectedFilters.price.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return selectedFilters.price.some((filter) => {
          const price = parseInt(product.skus[0].price); // Lấy giá từ SKU đầu tiên

          if (filter === "Dưới 100.000đ") return price < 100000;
          if (filter === "100.000đ - 200.000đ")
            return price >= 100000 && price <= 200000;
          if (filter === "Trên 200.000đ") return price > 200000;
          return false;
        });
      });
    }

    // Lọc theo màu sắc
    if (selectedFilters.color.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.skus.some((sku) => selectedFilters.color.includes(sku.color)) // Kiểm tra tất cả SKU
      );
    }

    // Lọc theo kích cỡ
    if (selectedFilters.size.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.skus.some((sku) => selectedFilters.size.includes(sku.size)) // Kiểm tra tất cả SKU
      );
    }

    // Lọc theo đánh giá
    if (selectedFilters.rating.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return selectedFilters.rating.some((filter) => {
          const rating = parseFloat(product.rating); // Lấy đánh giá từ sản phẩm
          if (filter.includes("1 sao")) return rating >= 1 && rating < 2;
          if (filter.includes("2 sao")) return rating >= 2 && rating < 3;
          if (filter.includes("3 sao")) return rating >= 3 && rating < 4;
          if (filter.includes("4 sao")) return rating >= 4 && rating < 5;
          if (filter.includes("5 sao")) return rating >= 5;
          return false;
        });
      });
    }

    // Lọc theo danh mục (nếu có)
    if (selectedFilters.category.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          selectedFilters.category.includes(product.category_name) ||
          selectedFilters.category.includes(product.parent_category_name)
      );
    }

    // Cập nhật danh sách sản phẩm đã lọc và chỉ giữ lại SKU đầu tiên
    const filteredProductsWithFirstSKU = filteredProducts.map((product) => ({
      ...product,
      skus: [product.skus[0]], // Giữ lại chỉ SKU đầu tiên
    }));

    setSortedProducts(filteredProductsWithFirstSKU);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value, checked) => {
    setSelectedFilters((prev) => {
      const currentFilter = prev[filterName] || [];
      const updatedOptions = checked
        ? [...currentFilter, value]
        : currentFilter.filter((option) => option !== value);
      return { ...prev, [filterName]: updatedOptions };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      price: [],
      color: [],
      size: [],
      category: [],
      rating: [],
    });
  };

  const addItemToCartHandler = async (product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (product.skus.length > 0) {
      const selectedVariant = product.skus[0]; // Chọn SKU phù hợp

      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`${API}/api/cart/add-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: selectedVariant.id, // Sử dụng ID SKU nếu có
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
    <div className="container mx-auto py-8 flex">
      <div className="w-2/12 pr-4">
        <h2 className="text-lg font-semibold mb-7 mt-[6px]">Bộ lọc</h2>
        <button
          onClick={clearFilters}
          className="bg-gray-300 rounded-3xl w-44 mb-5 text-black h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black"
        >
          Xóa Bộ Lọc
        </button>
        <div className="flex flex-col space-y-4">
          {filters.map((filter) => {
            if (filter.value === "category" && props.id) {
              return null;
            }

            return (
              <div key={filter.name} className="mb-4">
                <h3 className="font-semibold">{filter.name}:</h3>
                {filter.options.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.value]?.includes(option)}
                      value={option}
                      onChange={(e) =>
                        handleFilterChange(
                          filter.value,
                          option,
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <BreadCrumb name={nameBreadCrumb} />
          <select
            onChange={(e) => sortProducts(e.target.value)}
            className="border rounded p-2"
          >
            <option value="asc">Sắp xếp theo giá: Tăng dần</option>
            <option value="desc">Sắp xếp theo giá: Giảm dần</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="relative border rounded-lg shadow-lg overflow-hidden bg-white transition-transform transform hover:scale-105"
            >
              <div className="relative group">
                <img
                  src={product.skus[0].image}
                  alt={product.name}
                  className="w-96 h-96 object-cover transition-opacity duration-300 group-hover:opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-60">
                  <button className="bg-transparent w-52 text-white h-10 border border-transparent transition-all duration-400 ease">
                    <Link to={`/${product.id}`}>Xem chi tiết</Link>
                  </button>
                </div>
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-1 mb-2">
                  {formatPrice(product.skus[0].price)}
                </p>
                <button
                  onClick={() => addItemToCartHandler(product)}
                  className="bg-black w-52 text-white h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-2 px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
