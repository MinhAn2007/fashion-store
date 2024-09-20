import React, { useEffect, useState } from 'react';
import OurBestSellers from './OurBestSellers';
import { formatPrice } from '../utils/utils.js'; // Import formatPrice from utils
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    // Fetch data from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products?limit=10&page=1`); // Adjust limit and page as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Access the products array from the API response
        setProducts(data.products || []); // Ensure data.products exists and is an array
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API]);

  // Randomize image from cover array
  const getRandomImage = (cover) => {
    if (Array.isArray(cover) && cover.length > 0) {
      const randomIndex = Math.floor(Math.random() * cover.length);
      return cover[randomIndex];
    }
    return ''; // Return a default image or empty string if no image available
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='ourBestSellersMainParent mx-auto'>
      {products.map((item) => (
        <OurBestSellers
          key={item.id}
          id={item.id}
          title={item.name}
          price={formatPrice(item.price)}
          image={getRandomImage(item.cover)} // Randomize the image from cover array
        />
      ))}
    </div>
  );
};

export default Products;
