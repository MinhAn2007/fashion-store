import React from "react";
import "../styles/Ingridients.css";

import ing1 from "../assets/du.png";
import ing2 from "../assets/luoi.png";
import ing3 from "../assets/len.png";
import ing4 from "../assets/kaki.png";
import ing5 from "../assets/cotton.png";

const Ingridients = () => {
  return (
    <div className="text-center pt-24">
      <p className="text-4xl mb-12 font-semibold"> CHẤT LIỆU TẠO NÊN PHONG CÁCH </p>
      <div className="flex flex-wrap gap-24 justify-center">
        <div className="flex flex-col items-center">
          <img src={ing1} className="w-28 h-24" alt="Dù" />
          <p className="font-bold mt-2">Dù</p>
        </div>

        <div className="flex flex-col items-center">
          <img src={ing2} className="w-28 h-24" alt="Lưới" />
          <p className="font-bold mt-2">Lưới</p>
        </div>

        <div className="flex flex-col items-center">
          <img src={ing3} className="w-28 h-24" alt="Len" />
          <p className="font-bold mt-2">Len</p>
        </div>

        <div className="flex flex-col items-center">
          <img src={ing4} className="w-28 h-24" alt="Kaki" />
          <p className="font-bold mt-2">Kaki</p>
        </div>

        <div className="flex flex-col items-center">
          <img src={ing5} className="w-28 h-24" alt="Cotton" />
          <p className="font-bold mt-2">Cotton</p>
        </div>
      </div>
    </div>
  );
};

export default Ingridients;
