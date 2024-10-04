import React from "react";
import "../styles/Navbar.css";
import logo from "../assets/al.png";
import { useState } from "react";
import BestSellers from "./BestSellers";
import GiftSets from "./GiftSets";
import Body from "./Body";
import { FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  const showHandler = () => {
    setShow(true);
    setShow2(false);
    setShow3(false);
    setShow4(false);
  };

  const showHandler2 = () => {
    setShow2(true);
    setShow(false);
    setShow3(false);
    setShow4(false);
  };

  const showHandler3 = () => {
    setShow3(true);
    setShow(false);
    setShow2(false);
    setShow4(false);
  };

  const showHandler4 = () => {
    setShow4(true);
    setShow(false);
    setShow2(false);
    setShow3(false);
  };

  const dontShowHandler = () => {
    setShow(false);
    setShow2(false);
    setShow3(false);
    setShow4(false);
  };

  return (
    <header className="banner navbar " role="banner">
      <nav className="navbar fixed top-0" role="navigation" aria-label="menu">
        <Link to="/">
          <img
            src={logo}
            className=" ml-32 logo-img object-contain"
            alt="Fashion Store Logo"
          />
        </Link>

        <ul className="menuNav">
          <li
            className="dropdown nav-link nav-link-fade-up transition-all duration-700"
            onMouseOver={showHandler}
          >
            Nổi bật
            {show && (
              <div>
                <ul
                  className="dropdown-nav z-[999]"
                  onMouseLeave={dontShowHandler}
                >
                  <BestSellers> </BestSellers>
                </ul>
              </div>
            )}
          </li>
          <li
            className="dropdown nav-link nav-link-fade-up"
            onMouseOver={showHandler2}
          >
            SẢN PHẨM
            {show2 && (
              <ul
                className="dropdown-nav dropdown-nav2"
                onMouseLeave={dontShowHandler}
              >
                <GiftSets />
              </ul>
            )}
          </li>
          <li
            className="dropdown nav-link nav-link-fade-up"
            onMouseOver={showHandler2}
          >
            Áo
            {show2 && (
              <ul
                className="dropdown-nav dropdown-nav2"
                onMouseLeave={dontShowHandler}
              >
                <GiftSets />
              </ul>
            )}
          </li>{" "}
          <li
            className="dropdown nav-link nav-link-fade-up"
            onMouseOver={showHandler2}
          >
            Quần
            {show2 && (
              <ul
                className="dropdown-nav dropdown-nav2"
                onMouseLeave={dontShowHandler}
              >
                <GiftSets />
              </ul>
            )}
          </li>{" "}
          <li
            className="dropdown nav-link nav-link-fade-up"
            onMouseOver={showHandler2}
          >
            Phụ kiện
            {show2 && (
              <ul
                className="dropdown-nav dropdown-nav2"
                onMouseLeave={dontShowHandler}
              >
                <GiftSets />
              </ul>
            )}
          </li>
          <li
            className="dropdown nav-link nav-link-fade-up"
            onMouseOver={showHandler2}
          >
            Giày dép
            {show2 && (
              <ul
                className="dropdown-nav dropdown-nav2"
                onMouseLeave={dontShowHandler}
              >
                <GiftSets />
              </ul>
            )}
          </li>
        </ul>

        <div className="ml-auto mr-32">
          <Link to="/cart">
            <FaShoppingBag className="text-2xl mr-4 ml-20" />
          </Link>
          <Link to="/account">
            <FaUser className="text-2xl ml-10" /> {/* Icon tài khoản */}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;

/*    




             <div class="container">
                <div class="dropdown" onMouseOver={showHandler}>
                    <button class="dropbtn">Dropdown</button>
                    <div class="dropdown-content" onMouseLeave={dontShowHandler}>
                     {show && <BestSellers /> }
                    </div>
                </div>

                <div class="dropdown" onMouseOver={showHandler2}>
                    <button class="dropbtn">Dropdown</button>
                    <div class="dropdown-content" onMouseLeave={dontShowHandler}>
                    {show2 && <GiftSets /> }
                    </div>
                </div>


                <div class="dropdown">
                    <button class="dropbtn">Dropdown</button>
                    <div class="dropdown-content">
                        Link 1
                        Link 2
                        Link 3
                    </div>
                </div>


                <a href="#news">Link</a>
            </div>

            <h3>Dropdown Menu inside a Navigation Bar</h3>
            <p>Hover over the "Dropdown" link to see the dropdown menu.</p>

*/
