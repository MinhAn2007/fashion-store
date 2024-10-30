import React, { useEffect, useState } from "react";
import OurBestSellers from "./OurBestSellers";
import { formatPrice } from "../utils/utils.js"; 
import { Loader } from "rizzui";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/bestseller`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.products || []);
        console.log(data.products);

        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await fetch(`${API}/api/cart/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          localStorage.setItem("cartQuantity", data.totalQuantity);
          // Dispatch custom event
          window.dispatchEvent(
            new CustomEvent("cartQuantityUpdated", {
              detail: data.totalQuantity,
            })
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [API]);

  if (loading) {
    return (
      <div className="flex justify-center mx-auto min-h-[700px]">
        <Loader
          size="md"
          width={200}
          height={200}
          className="text-center my-40"
        />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-wrap gap-20 mt-14 justify-center">
      {products.map((item, index) => (
        <div className="" key={item.id}>
          <OurBestSellers
            id={item.id}
            title={item.name}
            price={formatPrice(item.skus[0].price)} // Format the price using formatPrice
            image={item.skus[0].image} // Randomize the image from cover array
          />
        </div>
      ))}
    </div>
  );
};

export default Products;
