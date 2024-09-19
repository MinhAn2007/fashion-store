import React, { useEffect, useState } from 'react';
import OurBestSellers from './OurBestSellers';

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='ourBestSellersMainParent'>
      {products.map((item) => (
        <OurBestSellers
          key={item.id}
          id={item.id}
          title={item.name}
          price={item.price}
          image={item.cover} // Ensure this matches the field in your API
        />
      ))}
    </div>
  );
};

export default Products;
