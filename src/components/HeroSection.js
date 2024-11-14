import React from "react";
import "../styles/HeroSection.css";
import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";

const HeroSection = () => {
  return (
    <div className="heroSecMainParent bg-gray-50 py-16">
      <p className="text-4xl text-center welcomeStore mt-6 font-bold text-gray-800">
        SỰ LỰA CHỌN HOÀN HẢO
      </p>
      <p className="text-center text-lg text-gray-600 my-4 max-w-md mx-auto">
        Hãy trao niềm tin, chúng tôi sẽ làm cho bạn hài lòng nhất!
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-20 mt-12 mx-auto px-4 md:px-24 max-w-5xl">

        {/* Item 1 */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 w-64">
          <img src={one} className="w-32 md:w-36 mb-6" alt="Bền bỉ theo thời gian" />
          <h3 className="text-lg font-semibold text-gray-700">Bền bỉ theo thời gian</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Chất liệu cao cấp đảm bảo độ bền vượt trội, đồng hành cùng bạn trong mọi hoạt động.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 w-64">
          <img src={two} className="w-32 md:w-36 mb-6" alt="Thoải mái vận động" />
          <h3 className="text-lg font-semibold text-gray-700">Thoải mái vận động</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Co giãn 4 chiều mang lại cảm giác thoải mái mỗi khi bạn vận động.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 w-64">
          <img src={three} className="w-32 md:w-36 mb-6" alt="Mềm mại, nâng niu" />
          <h3 className="text-lg font-semibold text-gray-700">Mềm mại, nâng niu</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Chất liệu mềm mại, êm ái, mang đến cảm giác dễ chịu cho làn da của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
