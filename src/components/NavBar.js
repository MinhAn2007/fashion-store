import React, { useState, useEffect } from "react";
import logo from "../assets/al.png";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaUser,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();
  const [cartQuantity, setCartQuantity] = useState(0);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.clear();
      setIsLoading(false);
      setLogoutMessage("Đăng xuất thành công!");
      setLogoutMessage("");
      navigate("/");
      window.location.reload();
    }, 2000); // Simulate loading time
  };

  useEffect(() => {
    const quantity = localStorage.getItem("cartQuantity");
    console.log(quantity);
    
    setCartQuantity(quantity ? parseInt(quantity) : 0);
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
              <li className="p-4 hover:bg-gray-100">
                <span>Đồng giá 199k</span>
              </li>
              <li className="p-4 hover:bg-gray-100">
                <span>Giảm sốc đến 50%</span>
              </li>
            </ul>
          </li>

          <li className="group relative">
            <span className="cursor-pointer py-2 hover:text-gray-600 flex items-center">
              SẢN PHẨM MỚI
            </span>
          </li>

          <li className="group relative">
            <span className="cursor-pointer py-2 hover:text-gray-600 flex items-center">
              BỘ SƯU TẬP
              <FaChevronDown className="ml-1 text-xs" />
            </span>
            <ul className="absolute left-0 hidden group-hover:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover:opacity-100">
              <li className="p-4 hover:bg-gray-100">
                <span className="font-bold">Accessories Silver</span>
              </li>
              <li className="p-4 hover:bg-gray-100">
                <span className="font-bold">Minimalism</span>
              </li>
            </ul>
          </li>
        </ul>

        <div className="flex items-center space-x-6 mr-36">
          <div className="relative w-3/5">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border border-gray-300 rounded-full py-1 pl-10 pr-4 focus:outline-none w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    to="/register"
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
