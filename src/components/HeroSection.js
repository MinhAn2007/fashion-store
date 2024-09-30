import React from "react";
import "../styles/HeroSection.css";
import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";

const HeroSection = () => {
  return (
    <div className="heroSecMainParent">
      <p className="text-4xl text-center welcomeStore mt-6">HEY! FIND YOUR STYLE.</p>
      <p className="text-center text-xl my-6">
        {" "}
        If you don't conform to the way others dress, you don't have to conform
        to their way of thinking.{" "}
      </p>

      <div className="flex flex-row items-center mt-10 mx-64 text-algin">
        <div className="flex flex-row items-center mx-4">
          <img src={one} className="w-24 mr-8" alt="Image 1" />
          <div className="flex flex-col">
            <p className="text-xl font-medium text-gray-700">Made to Last</p>
            <p className="mb-2 break-words">
              Our shirts are crafted from soft, breathable fabrics for ultimate
              comfort and a tailored fit.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center mx-4">
          <img src={two} className="w-24 mr-8" alt="Image 2" />
          <div className="flex flex-col">
            <p className="text-xl font-medium text-gray-700">
              Crafted for Comfort
            </p>
            <p className="mb-2 break-words">
              Made from gentle, skin-friendly materials, they offer a luxurious
              feel against your skin.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center mx-4">
          <img src={three} className="w-24 mr-8" alt="Image 3" />
          <div className="flex flex-col">
            <p className="text-xl font-medium text-gray-700">
              Soft on Your Skin
            </p>
            <p className="mb-2 break-words">
              Our jeans feature durable fabrics and meticulous stitching,
              ensuring long-lasting wear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
