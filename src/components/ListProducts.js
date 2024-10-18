"use client";

import React, { useState, useEffect } from "react";
import BreadCrumb from "./BreadCrumb";
import "../styles/SinglePage.css";

const categories = [
  "Tất cả sản phẩm",
  "Sản phẩm mới",
  "Khuyến mãi",
  "Bán chạy",
  "Đồ ăn nhanh",
  "Thức uống",
];

const filters = [
  {
    name: "Giá",
    options: ["Dưới 100.000đ", "100.000đ - 200.000đ", "Trên 200.000đ"],
    type: "checkbox", // Chuyển từ radio sang checkbox
  },
  {
    name: "Màu sắc",
    options: ["Đỏ", "Vàng", "Xanh", "Đen", "Trắng"],
    type: "checkbox",
  },
  {
    name: "Kích cỡ",
    options: ["S", "M", "L", "XL"],
    type: "checkbox",
  },
  {
    name: "Thương hiệu",
    options: ["Brand A", "Brand B", "Brand C"],
    type: "checkbox",
  },
  {
    name: "Đánh giá",
    options: ["1 sao", "2 sao", "3 sao", "4 sao", "5 sao"],
    type: "checkbox",
  },
  {
    name: "Tình trạng sản phẩm",
    options: ["Mới", "Cũ", "Thời trang"],
    type: "checkbox",
  },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    color: [],
    size: [],
    brand: [],
    rating: [],
    status: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [API]);

  useEffect(() => {
    setSortedProducts(products);
  }, [products]);

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
    const sorted = [...products].sort((a, b) => {
      const priceA = parseInt(a.skus[0].price); // Xử lý giá để so sánh
      const priceB = parseInt(b.skus[0].price);
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
    setSortedProducts(sorted);
  };

  const handleFilterChange = (filterName, value, checked) => {
    setSelectedFilters((prev) => {
      // Nếu thuộc tính chưa tồn tại, khởi tạo nó là một mảng rỗng
      const currentFilter = prev[filterName] || [];
      const updatedOptions = checked
        ? [...currentFilter, value] // Thêm giá trị vào mảng nếu đã chọn
        : currentFilter.filter((option) => option !== value); // Xóa giá trị khỏi mảng nếu không chọn
      return { ...prev, [filterName]: updatedOptions };
    });
  };

  return (
    <div className="container mx-auto py-8 flex">
      <div className="w-2/12 pr-4">
        <h2 className="text-lg font-semibold mb-5 mt-[6px]">Bộ lọc</h2>
        <div className="flex flex-col space-y-4">
          {filters.map((filter) => (
            <div key={filter.name} className="mb-4">
              <h3 className="font-semibold">{filter.name}:</h3>
              {filter.options.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFilters[filter.name.toLowerCase()]?.includes(option)}
                    value={option}
                    onChange={(e) =>
                      handleFilterChange(filter.name.toLowerCase(), option, e.target.checked)
                    }
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <BreadCrumb name="Tất cả sản phẩm" />
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
                  <button
                    className="bg-transparent w-52 text-white h-10 border border-transparent transition-all duration-400 ease"
                    onClick={() => alert("Đang phát triển")}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-1 mb-2">
                  {product.skus[0].price}
                </p>
                <button className="bg-black w-52 text-white h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black">
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
