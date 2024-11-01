import React, { useState, useEffect } from "react";
import logo from "../assets/al.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaUser,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { useAuthWithCheck } from "../hooks/useAuth";
import { debounce } from "lodash";
import { formatPrice } from "../utils/utils";

const categories = {
  ao: {
    name: "Áo",
    subcategories: ["Áo khoác", "Áo thun", "Áo Sơ mi", "Polo"],
  },
  quan: {
    name: "Quần",
    subcategories: ["Quần vải", "Quần Tây", "Quần Jean", "Chân Váy"],
  },
  phukien: {
    name: "Phụ Kiện",
    subcategories: [],
  },
  giay: {
    name: "Giày Dép",
    subcategories: [],
  },
};

const NavBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();
  const [cartQuantity, setCartQuantity] = useState(0);
  const { isAuthenticated } = useAuthWithCheck();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const API = process.env.REACT_APP_API_ENDPOINT;

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.clear();
      setIsLoading(false);
      setLogoutMessage("Đăng xuất thành công!");
      setTimeout(() => setLogoutMessage(""), 3000);
      navigate("/");
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    const quantity = localStorage.getItem("cartQuantity");
    setCartQuantity(quantity ? parseInt(quantity) : 0);

    const handleCartUpdate = (event) => {
      console.log("Cart quantity updated:", event.detail);
      const newQuantity = event.detail;
      setCartQuantity(newQuantity);
    };

    window.addEventListener("cartQuantityUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartQuantityUpdated", handleCartUpdate);
    };
  }, []);

  // Hàm kiểm tra category matching
  const checkCategoryMatch = (term) => {
    term = term.toLowerCase();

    for (const [key, category] of Object.entries(categories)) {
      if (category.name.toLowerCase().includes(term)) {
        return {
          type: "category",
          message: `Tìm kiếm sản phẩm trong: ${category.name}`,
          path: `/${key}`,
        };
      }

      for (const subcat of category.subcategories) {
        if (subcat.toLowerCase().includes(term)) {
          return {
            type: "subcategory",
            message: `Tìm kiếm ${subcat} trong ${category.name}`,
            path: `/${key}?subcategory=${subcat}`,
          };
        }
      }
    }
    return null;
  };

  const fetchSearchResults = async (term) => {
    setIsSearching(true);
    try {
      const categoryMatch = checkCategoryMatch(term);
      let finalResults = [];
      
      if (categoryMatch) {
        finalResults.push(categoryMatch);
      }

      // Then fetch product results
      const response = await fetch(`${API}/api/search?q=${term}`);
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        const productResults = data.products.map((product) => ({
          type: "product",
          id: product.id,
          name: product.name,
          min_price: formatPrice(product.skus[0].price),
          image: product.skus[0].image,
        }));
        
        // Add product results after category results
        finalResults = [...finalResults, ...productResults];
      }

      // If no results found at all
      if (finalResults.length === 0) {
        finalResults = [
          {
            type: "message",
            message: "Không tìm thấy sản phẩm phù hợp",
          },
        ];
      }

      setSearchResults(finalResults);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([
        {
          type: "message",
          message: "Có lỗi xảy ra khi tìm kiếm",
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = debounce((term) => {
    if (term.trim().length >= 2) {
      fetchSearchResults(term);
    } else {
      setSearchResults([]);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);
    debouncedSearch(value);
  };

  const handleSearchClick = (result) => {
    if (result.type === "category" || result.type === "subcategory") {
      navigate(result.path);
    } else if (result.type === "product") {
      navigate(`/${result.id}`);
    }
    setShowResults(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="text-white text-2xl">Đang đăng xuất...</div>
        </div>
      )}

      <div className="banner navbar mr-auto w-full flex items-center justify-between gap-x-16 h-20 bg-[#F8F8FF] shadow-md fixed top-0 z-40">
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            className="ml-36 object-contain w-40 h-40"
            alt="Fashion Store Logo"
          />
        </Link>

        <ul className="flex font-bold gap-x-24 -ml-40">
          <li className="group relative">
            <Link
              to="/products"
              className="cursor-pointer py-2 hover:text-gray-600 flex items-center"
            >
              SẢN PHẨM
              <FaChevronDown className="ml-1 text-xs" />
            </Link>
            <ul className="absolute left-0 hidden group-hover:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover:opacity-100">
              <li className="group/nested relative p-4 hover:bg-gray-100">
                <Link to="/ao">
                  <span className="font-bold cursor-pointer flex items-center justify-between">
                    Áo
                    <FaChevronRight className="ml-1 text-xs" />
                  </span>
                </Link>
                <ul className="absolute left-full top-0 hidden group-hover/nested:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover/nested:opacity-100">
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Áo khoác</p>
                  </li>
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Áo thun</p>
                  </li>
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Áo Sơ mi</p>
                  </li>
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Polo</p>
                  </li>
                </ul>
              </li>
              <li className="group/nested relative p-4 hover:bg-gray-100">
                <Link to="/quan">
                  <span className="font-bold cursor-pointer flex items-center justify-between">
                    Quần
                    <FaChevronRight className="ml-1 text-xs" />
                  </span>
                </Link>
                <ul className="absolute left-full top-0 hidden group-hover/nested:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover/nested:opacity-100">
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Quần vải</p>
                  </li>
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Quần Tây</p>
                  </li>
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Quần Jean</p>
                  </li>
                  <li className="p-4 hover:bg-gray-100">
                    <p className="font-bold">Chân Váy</p>
                  </li>
                </ul>
              </li>
              <li className="p-4 hover:bg-gray-100">
                <Link to="/phukien">
                  <span>Phụ Kiện</span>
                </Link>
              </li>
              <li className="p-4 hover:bg-gray-100">
                <Link to="/giay">
                  <span>Giày Dép</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className="group relative">
            <span className="cursor-pointer py-2 hover:text-gray-600 flex items-center">
              SẢN PHẨM SALE
              <FaChevronDown className="ml-1 text-xs" />
            </span>
            <ul className="absolute left-0 hidden group-hover:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover:opacity-100">
              <Link to="/sale-199k" className="hover:text-gray-600">
                <li className="p-4 hover:bg-gray-100">
                  <span>Đồng giá 199k</span>
                </li>
              </Link>
            </ul>
          </li>
          <li className="group relative">
            <Link to="/new-products" className="hover:text-gray-600">
              <span className="cursor-pointer py-2 hover:text-gray-600 flex items-center">
                SẢN PHẨM MỚI
              </span>
            </Link>
          </li>
          <li className="group relative">
            <span className="cursor-pointer py-2 hover:text-gray-600 flex items-center">
              BỘ SƯU TẬP
              <FaChevronDown className="ml-1 text-xs" />
            </span>
            <ul className="absolute left-0 hidden group-hover:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover:opacity-100">
              <Link to="/minimum-style" className="hover:text-gray-600">
                <li className="p-4 hover:bg-gray-100">
                  <span className="font-bold">Minimalism</span>
                </li>
              </Link>
              <li className="p-4 hover:bg-gray-100">
                <Link to="/accessories" className="hover:text-gray-600">
                  <span className="font-bold">Accessories Silver</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>

        <div className="flex items-center space-x-6 mr-36">
          <div className="relative w-3/5 search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              placeholder="Nhập tên sản phẩm..."
              className="border border-gray-300 rounded-full py-1 pl-10 pr-4 focus:outline-none w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            {showResults && searchTerm.length >= 2 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tìm kiếm...
                  </div>
                ) : (
                  <div>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSearchClick(result)}
                      >
                        {result.type === "message" ? (
                          <p className="text-gray-500">{result.message}</p>
                        ) : result.type === "category" ||
                          result.type === "subcategory" ? (
                          <div className="flex items-center">
                            <FaSearch className="mr-2 text-gray-400" />
                            <p>{result.message}</p>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center p-4 border-b">
                            <img
                              src={result.image}
                              alt={result.name}
                              className="w-16 h-16 object-cover mr-4"
                            />
                            <div className="flex flex-col justify-center">
                              <p className="text-sm font-semibold">
                                {result.name}
                              </p>
                              <p className="text-gray-600">
                                {result.min_price}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="relative hover:text-gray-600">
            <FaShoppingBag className="text-2xl" />
            {cartQuantity > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {cartQuantity}
              </span>
            )}
          </Link>

          <div className="relative group">
            <Link to="/account" className="hover:text-gray-600">
              <FaUser className="text-2xl" />
            </Link>
            <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-lg">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="block w-44 text-left  px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Thông tin tài khoản
                  </Link>

                  <Link
                    to="/order-list"
                    className="block w-44 text-left  px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    to="/history"
                    className="block w-44 text-left  px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Lịch sử mua hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-44 text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-32 text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-32 text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {logoutMessage && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          {logoutMessage}
        </div>
      )}
    </>
  );
};

export default NavBar;
