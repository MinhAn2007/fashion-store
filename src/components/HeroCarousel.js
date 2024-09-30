import React, { Component } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../assets/banner4.png";
import banner2 from "../assets/banner4.png";
import banner3 from "../assets/banner4.png";

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,          
      autoplaySpeed: 3000,     
    };

    return (
      <div className="carousel-contain">
        <Slider {...settings}>
          <div>
            <img src={banner2} className="car-pic" alt="Banner 1" />
          </div>
          <div>
            <img src={banner3} className="car-pic" alt="Banner 2" />
          </div>
          <div>
            <img src={banner1} className="car-pic" alt="Banner 3" />
          </div>
        </Slider>
      </div>
    );
  }
}
