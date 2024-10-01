import React from "react";
import "../styles/JournalSection.css";
import { Link } from "react-router-dom";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

const JournalSection = () => {
  return (
    <div className="bg-gray-50 mt-16 flex flex-col md:flex-row pt-10 shadow-lg rounded-lg p-12">
      <div className="w-full md:w-1/3 mx-auto md:ml-20 lg:ml-64 relative mr-12">
        <img
          src="https://cdn.shopify.com/s/files/1/0081/7374/8305/files/Sukin_Journal_Heading_2-01_2500x2500_6e692e60-90cb-4cd0-9006-a6f1d09fe1c4_360x.png?v=1613561992"
          alt="Journal Heading"
          className="w-72"
        />
        <p className="mt-4 text-gray-700 text-xs sm:text-sm md:text-base lg:text-base w-full max-w-md mr-0 leading-snug">
          Khám phá thế giới thời trang hiện đại qua lăng kính của chúng tôi! Từ
          xu hướng mới nhất, cách phối đồ độc đáo đến bí quyết tự tin tỏa sáng.
          Hãy cùng chúng tôi khám phá những điều thú vị nhất trong lĩnh vực thời
          trang.
        </p>
        <Link to={`/journal/april`}>
          <button className="bg-gray-900 text-white w-full md:w-44 h-12 rounded-lg transition duration-300 ease-in-out hover:bg-[#e7e3db] mt-6 shadow-md">
            READ THE JOURNAL
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-24 md:justify-end mt-8 md:mt-0 md:mr-44">
        <Link to={`/journal/april`} className="flex flex-col items-center">
          <img
            src={banner2}
            alt="Minimalism"
            className="w-full md:w-96 h-auto rounded-xl shadow-lg"
          />
          <p className="font-bold mt-6 text-center text-xs sm:text-sm md:text-sm lg:text-base">
            Phong cách tối giản - MINIMALISM
          </p>
        </Link>
        <Link to={`/journal/april`} className="flex flex-col items-center">
          <img
            src={banner3}
            alt="Accessories"
            className="w-full md:w-96 h-auto rounded-xl shadow-lg"
          />
          <p className="font-bold mt-6 text-center text-xs sm:text-sm md:text-sm lg:text-base">
            Phụ kiện thể hiện tính cách - ACCESSORIES
          </p>
        </Link>
      </div>
    </div>
  );
};

export default JournalSection;
