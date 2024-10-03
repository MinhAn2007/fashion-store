import React from "react";
import "../styles/HeroSection.css";
import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";

const HeroSection = () => {
  return (
    <div className="heroSecMainParent">
      <p className="text-4xl text-center welcomeStore mt-6">SỰ LỰA CHỌN HOÀN HẢO.</p>
      <p className="text-center text-xl my-6">
        {" "}
        Hãy trao niềm tin, chúng tôi sẽ làm cho bạn hài lòng nhất !{" "}
      </p>

      <div className="flex flex-row items-center mt-10 mx-64 text-algin">
        <div className="flex flex-row items-center mx-4">
          <img src={one} className="w-24 mr-8" alt="Image 1" />
          <div className="flex flex-col">
            <p className="text-xl font-medium text-gray-700">Bền bỉ theo thời gian</p>
            <p className="mb-2 break-words">
              Chất liệu cao cấp đảm bảo độ bền vượt trội, đồng hành cùng bạn trong mọi hoạt động.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center mx-4">
          <img src={two} className="w-24 mr-8" alt="Image 2" />
          <div className="flex flex-col">
            <p className="text-xl font-medium text-gray-700">
              Thoải mái vận động.
            </p>
            <p className="mb-2 break-words">
              Co giãn 4 chiều mang lại cảm giác thoải mái mỗi khi bạn vận động.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center mx-4">
          <img src={three} className="w-24 mr-8" alt="Image 3" />
          <div className="flex flex-col">
            <p className="text-xl font-medium text-gray-700">
              Mềm mại, nâng niu
            </p>
            <p className="mb-2 break-words">
              Chất liệu mềm mại, êm ái, mang đến cảm giác dễ chịu cho làn da của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
