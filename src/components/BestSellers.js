import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton component
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles
import HoverImage from 'react-hover-image/build';
import { Link } from 'react-router-dom';
import "../styles/BestSellers.css";
import { formatPrice } from '../utils/utils.js'; // Import formatPrice from utils

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const controller = new AbortController(); // Create a new AbortController instance

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products?limit=4&page=1`, { // Fetch 4 products
          signal: controller.signal // Pass the signal to the fetch request
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data.products || []); // Ensure data.products exists and is an array
      } catch (error) {
        if (error.name !== 'AbortError') { // Check if the error is not due to abort
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      controller.abort(); // Cleanup function to abort the fetch request
    };
  }, [API]);

  // Function to get the first image URL from the cover array
  const getFirstImageUrl = (coverArray) => {
    if (Array.isArray(coverArray) && coverArray.length > 0) {
      return coverArray[0]; // Return the first URL
    }
    return ''; // Return an empty string if coverArray is not valid
  };

  if (loading) {
    return (
      <div className='bestSellerMainParent flex flex-row'>
        {Array(4).fill().map((_, index) => ( // Display skeleton for 4 items
          <div className="bestSellerIndivitualItem" key={index}>
            <Skeleton height={200} width={200} className="bestSellerImage rounded-xl mb-6" />
            <Skeleton height={20} width={150} className='bestSellerName text-center mb-2' />
            <Skeleton height={20} width={100} className='font-normal text-center' />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='bestSellerMainParent flex flex-row'>
      {products.map((item) => (
        <Link to={`/${item.id}`} key={item.id} className='bestSellerLink'>
          <div className="bestSellerIndivitualItem">
            <HoverImage 
              src={getFirstImageUrl(item.cover)} // Use the function to get the first image URL
              hoverSrc={getFirstImageUrl(item.cover)} // Assuming the hover image is the same as primary image
              className="bestSellerImage rounded-xl mb-6"
            />
            <p className='bestSellerName text-center mb-2'>{item.name}</p>
            <p className='font-normal text-center'>{formatPrice(item.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BestSellers;
