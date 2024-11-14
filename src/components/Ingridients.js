import React from "react";
import "../styles/Ingridients.css";

import ing1 from "../assets/du.png";
import ing2 from "../assets/luoi.png";
import ing3 from "../assets/len.png";
import ing4 from "../assets/kaki.png";
import ing5 from "../assets/cotton.png";

const Ingridients = () => {
  return (
    <div className="text-center pt-24 pb-16 bg-gray-50">
      <p className="text-4xl mb-12 font-semibold text-gray-800">
        CHẤT LIỆU TẠO NÊN PHONG CÁCH
      </p>

      <div className="flex flex-wrap gap-20 justify-center max-w-5xl mx-auto px-4">
        {/* Item 1 */}
        <div className="flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <img src={ing1} className="w-32 h-28 rounded-lg shadow-md" alt="Dù" />
          <p className="font-bold mt-4 text-gray-700">Dù</p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <img src={ing2} className="w-32 h-28 rounded-lg shadow-md" alt="Lưới" />
          <p className="font-bold mt-4 text-gray-700">Lưới</p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <img src={ing3} className="w-32 h-28 rounded-lg shadow-md" alt="Len" />
          <p className="font-bold mt-4 text-gray-700">Len</p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <img src={ing4} className="w-32 h-28 rounded-lg shadow-md" alt="Kaki" />
          <p className="font-bold mt-4 text-gray-700">Kaki</p>
        </div>

        {/* Item 5 */}
        <div className="flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <img src={ing5} className="w-32 h-28 rounded-lg shadow-md" alt="Cotton" />
          <p className="font-bold mt-4 text-gray-700">Cotton</p>
        </div>
      </div>
    </div>
  );
};

export default Ingridients;
