import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { store } from '../productsStore/Store';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-state/CartState';
import BreadCrumb from './BreadCrumb';
import "../styles/SinglePage.css";
import { AiFillStar } from "react-icons/ai";
import SinglePageFAQ from './SinglePageFAQ';
import AutoPlayMethods from './SingleAlsoLike';
import JournalSection from "./JournalSection";
import SearchBox from './SearchBox';
import Review1 from './Review1';
import { FaShippingFast } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import SPFooter from './SPFooter';
import { GiCardboardBoxClosed } from "react-icons/gi";
import { useToast } from '@chakra-ui/react';

const SinglePage = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API}/api/product/${id}`);
        const data = await response.json();
        console.log(data);

        setProduct(data); // Use the product object directly
        if (data.cover && data.cover.length > 0) {
          setActiveImg(data.cover[0]); // Set the default active image
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const addItemToCartHandler = () => {
    if (selectedVariant) {
      dispatch(
        cartActions.addItemToCart({
          id,
          price: selectedVariant.price,
          title: product.name,
          image: activeImg,
        })
      );
      toast({
        title: 'Success',
        description: "Successfully Added to Cart",
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className='singlePageMainParent relative top-36'>
      <div className="bgGrey h-14 sinLih">
        <BreadCrumb name={product.name} />
      </div>

      <figure className='singlePageMainPicHold relative'>
        <img src={activeImg} alt="Product Image" className="w-48 cursor-pointer rounded-2xl object-cover singlePageMainPic" />
      </figure>

      <div className='sideImageHold flex flex-col relative gap-12'>
        {product.cover.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`Product Image ${index + 1}`} 
            className="w-64 cursor-pointer object-cover" 
            onMouseEnter={() => setActiveImg(img)} 
            onMouseLeave={() => setActiveImg(product.cover[0])} 
          />
        ))}
      </div>

      <div className='namePriceSP relative fof flex flex-col gap-6'>
        <p className='font-semibold text-xl w-80'>{product.name}</p>
        <p className='text-xl sp relative'>${selectedVariant ? selectedVariant.price : product.variants[0].price}</p>
      </div>

      <div className='relative gap-2 flex starHold'>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className='flex'>
            {index < Math.floor(Math.random() * 5) ? <AiFillStar /> : ""}
          </div>
        ))}
        <p className='font-semibold l1rem'>{Math.floor(Math.random() * (999 - 100 + 1) + 100)} reviews</p>
      </div>

      <div className='spBtnHold relative'>
        <button className='spAddTOCart' onClick={addItemToCartHandler}>ADD TO CART</button>
      </div>

      <div>
        <SinglePageFAQ />
      </div>

      <AutoPlayMethods />
      <Review1 starCalc={5} rev={Math.floor(Math.random() * (999 - 100 + 1) + 100)} />
      <SearchBox />
      <JournalSection />

      <div className='footerFeatures2 flex flex-row absolute'>
        <FaShippingFast className='w-16 h-20 sv' />
        <FaLock className='w-12 h-16 sv2' />
        <BsCurrencyDollar className='w-16 h-20 sv' />
        <GiCardboardBoxClosed className='w-16 h-20 sv' />
      </div>
    </div>
  );
};

export default SinglePage;
