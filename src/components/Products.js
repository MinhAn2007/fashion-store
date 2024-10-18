import React, { useEffect, useState } from 'react';
import OurBestSellers from './OurBestSellers';
import { formatPrice } from '../utils/utils.js'; // Import formatPrice from utils
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
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        
        setProducts(data.products || []);        
      } catch (error) {
        if (error.name !== 'AbortError') {
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='flex flex-wrap gap-20 mt-14 justify-center'>
    {products.map((item, index) => (
      <div className='' key={item.id}>
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
