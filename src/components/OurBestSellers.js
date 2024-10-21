import React from "react";
import { store } from "../productsStore/Store";
import "../styles/OurBestSellers.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux-state/CartState";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OurBestSellers = (props) => {
  const { title, price, id, image } = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const addItemToCartHandler = (e) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    dispatch(
      cartActions.addItemToCart({
        id,
        price,
        title,
        image,
      })
    );

    toast({
      title: "",
      description: "Successfully Added",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  };

  return (
    <div>
      <div
        key={id}
        className="mx-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div className="card w-96 bg-gray-50 shadow-xl py-10 ">
          <Link to={`/${id}`}>
            <figure className="pt-6">
              <img
                src={image}
                alt={title}
                className="rounded-xl w-3/5 h-auto"
              />
            </figure>
          </Link>
          <div className="card-body items-center text-center p-2">
            <h2 className="card-title mb-1 font-bold text-xl">{title}</h2>
            <h2 className="text-xl mb-2">{price}</h2>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  addItemToCartHandler();
                }}
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBestSellers;
