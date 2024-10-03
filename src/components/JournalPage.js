import React, { useEffect } from 'react';
import fashionImg1 from "../assets/banner1.png";
import fashionImg3 from "../assets/banner3.png";
import fashionImg2 from "../assets/banner2.png";
import { FaShippingFast, FaLock } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";

const FashionBlogPage = () => {
  // Scroll to the top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center py-8">
      {/* Header */}
      <div className="w-full max-w-4xl text-center px-4">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Tạp Chí Thời Trang</h1>
        <p className="text-lg text-gray-600 mb-6">
          Chào mừng đến với thế giới thời trang hiện đại! Từ xu hướng mới nhất, cách phối đồ độc đáo, đến bí quyết tự tin tỏa sáng.
          Hãy cùng chúng tôi khám phá những điều thú vị nhất trong lĩnh vực thời trang.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl px-4">
        {/* Feature Article */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Tháng 10: Xu Hướng Thời Trang Mới & Mẹo Phối Đồ</h2>
          <img src={fashionImg2} alt="Fashion Trends" className="w-full h-auto rounded-lg shadow-lg mb-6" />
          <p className="text-lg text-gray-600 leading-relaxed">
            Tháng 10 này, xu hướng thời trang tập trung vào sự kết hợp giữa phong cách tối giản và màu sắc nổi bật.
            Các gam màu pastel nhẹ nhàng đang chiếm lĩnh sân khấu thời trang đường phố, kết hợp cùng các phụ kiện đơn giản
            để tạo nên một phong cách hài hòa nhưng không kém phần nổi bật. Hãy chọn những trang phục nhẹ nhàng, thoải mái
            nhưng vẫn thể hiện cá tính riêng của bạn.
          </p>
        </div>

        {/* Articles Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <img src={fashionImg1} alt="Minimalism Fashion" className="w-full h-auto rounded-lg shadow-lg mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Phong Cách Tối Giản - Minimalism</h3>
            <p className="text-gray-600 leading-relaxed">
              Thời trang tối giản vẫn đang là xu hướng được yêu thích, với các bộ trang phục cơ bản như áo thun trắng, quần jeans đen 
              hoặc áo blazer đơn giản. Điều quan trọng của phong cách này là sự tinh tế trong cách chọn lựa và phối hợp các phụ kiện 
              để tạo nên tổng thể hài hòa, thanh lịch.
            </p>
          </div>

          <div>
            <img src={fashionImg3} alt="Accessories Trends" className="w-full h-auto rounded-lg shadow-lg mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Phụ Kiện Phong Cách - Accessories</h3>
            <p className="text-gray-600 leading-relaxed">
              Một trong những điểm nhấn của thời trang hiện đại chính là việc sử dụng phụ kiện để làm nổi bật trang phục.
              Những chiếc túi nhỏ xinh, vòng cổ tinh tế hay mũ rộng vành đang trở thành xu hướng được săn đón. Bạn có thể 
              dễ dàng biến tấu trang phục của mình trở nên phong cách và nổi bật hơn chỉ với một vài phụ kiện đơn giản.
            </p>
          </div>
        </div>

        {/* Footer Icons */}
        <div className="flex flex-col md:flex-row items-center justify-around w-full mt-12 space-y-6 md:space-y-0">
          <div className="flex flex-col items-center text-center p-4">
            <FaShippingFast className="text-6xl text-gray-500 mb-2" />
            <p className="text-lg font-medium text-gray-700">Giao Hàng Nhanh</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <FaLock className="text-6xl text-gray-500 mb-2" />
            <p className="text-lg font-medium text-gray-700">Thanh Toán An Toàn</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <BsCurrencyDollar className="text-6xl text-gray-500 mb-2" />
            <p className="text-lg font-medium text-gray-700">Điểm Thưởng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FashionBlogPage;
