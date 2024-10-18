"use client";

import React, { useState } from "react";
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
    type: "radio",
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

const products = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 4,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 5,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 6,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 7,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 8,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 9,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 10,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 11,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 12,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 13,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 14,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 15,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 16,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 17,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 18,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 19,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl:
      "https://thorstore.vn/upload/hinhthem/f7817d89ba5a4f4686a4ef0371198be3-1533454_400x530.jpeg",
  },
  {
    id: 20,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 21,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 22,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 23,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 24,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 25,
    name: "Sản phẩm 2333",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 26,
    name: "Sản phẩm 33333",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 27,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 28,
    name: "Sản phẩm 2",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 29,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 30,
    name: "Sản phẩm 1",
    price: "100.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 31,
    name: "Sản phẩm 2333",
    price: "150.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 32,
    name: "Sản phẩm 3",
    price: "200.000đ",
    imageUrl: "https://via.placeholder.com/300x200",
  },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedFilters, setSelectedFilters] = useState({
    price: "",
    color: "",
    size: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Số sản phẩm mỗi trang

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm để sắp xếp sản phẩm theo giá
  const sortProducts = (order) => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/\./g, "").replace("đ", ""));
      const priceB = parseInt(b.price.replace(/\./g, "").replace("đ", ""));
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
    return sortedProducts;
  };

  return (
    <div className="container mx-auto py-8 flex">
      {/* Danh mục */}
      <div className="w-2/12 pr-4">
        <h2 className="text-lg font-semibold mb-5 mt-[6px]">Bộ lọc</h2>
        <div className="flex flex-col space-y-4">
          {filters.map((filter) => (
            <div key={filter.name} className="mb-4">
              <h3 className="font-semibold">{filter.name}:</h3>
              {filter.type === "radio"
                ? filter.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name={filter.name}
                        value={option}
                        checked={selectedFilters.price === option}
                        onChange={(e) =>
                          handleFilterChange(
                            filter.name.toLowerCase(),
                            e.target.value,
                            true
                          )
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))
                : filter.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[
                          filter.name.toLowerCase()
                        ]?.includes(option)}
                        value={option}
                        onChange={(e) =>
                          handleFilterChange(
                            filter.name.toLowerCase(),
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

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="relative border rounded-lg shadow-lg overflow-hidden bg-white transition-transform transform hover:scale-105"
            >
              <div className="relative group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-96 h-96 object-cover transition-opacity duration-300 group-hover:opacity-50" // Điều chỉnh chiều dài h-48
                />
                {/* Modal hiển thị khi hover */}
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
                <p className="text-gray-600 mt-1 mb-2">{product.price}</p>
                <button className="bg-black w-52 text-white h-10 border border-transparent transition-all duration-400 ease hover:bg-white hover:text-black hover:border-black">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
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
