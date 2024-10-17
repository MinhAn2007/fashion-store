import React from "react";
import logo from "../assets/al.png";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaUser,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

const NavBar = () => {
  return (
    <div className=" banner navbar mr-auto w-full flex items-center justify-between gap-x-40 h-20 bg-[#F8F8FF] shadow-md fixed top-0 z-50">
      <Link to="/" className="flex-shrink-0">
        <img
          src={logo}
          className="ml-20 object-contain w-40 h-40"
          alt="Fashion Store Logo"
        />
      </Link>

      <ul className="flex font-bold gap-x-24 ml-16">
        <li className="group relative">
          <span className="cursor-pointer py-2 hover:text-gray-600 flex items-center">
            SẢN PHẨM
            <FaChevronDown className="ml-1 text-xs" />
          </span>
          <ul className="absolute left-0 hidden group-hover:block bg-[#F8F8FF] shadow-lg w-48 transition-all ease-in-out opacity-0 group-hover:opacity-100">
            <li className="group/nested relative p-4 hover:bg-gray-100">
              <span className="font-bold cursor-pointer flex items-center justify-between">
                Áo
                <FaChevronRight className="ml-1 text-xs" />
              </span>
              <ul className="absolute left-full top-0 hidden group-hover/nested:block  bg-[#F8F8FF] shadow-lg w-48   transition-all duration-10000 ease-in-out opacity-0 group-hover/nested:opacity-100">
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Áo khoác</p>
                </li>
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Áo thun</p>
                </li>{" "}
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Áo Sơ mi</p>
                </li>{" "}
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Polo</p>
                </li>
              </ul>
            </li>
            <li className="group/nested relative p-4 hover:bg-gray-100">
              <span className="font-bold cursor-pointer flex items-center justify-between">
                Quần
                <FaChevronRight className="ml-1 text-xs" />
              </span>
              <ul className="absolute left-full top-0 hidden group-hover/nested:block  bg-[#F8F8FF] shadow-lg w-48   transition-all duration-10000 ease-in-out opacity-0 group-hover/nested:opacity-100">
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Quần vải</p>
                </li>
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Quần Tây</p>
                </li>{" "}
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Quần Jean</p>
                </li>{" "}
                <li className="p-4 hover:bg-gray-100">
                  <p className="font-bold">Chân Váy</p>
                </li>
              </ul>
            </li>
            <li className="p-4 hover:bg-gray-100">
              <span>Phụ Kiện</span>
            </li>
            <li className="p-4 hover:bg-gray-100">
              <span>Giày Dép</span>
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
            </li>{" "}
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

      <div className="flex items-center space-x-6 mr-20">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-300 rounded-full py-1 pl-10 pr-4 focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Link to="/cart" className="hover:text-gray-600">
          <FaShoppingBag className="text-2xl" />
        </Link>
        <Link to="/account" className="hover:text-gray-600">
          <FaUser className="text-2xl" />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
