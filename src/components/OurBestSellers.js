import React from 'react';
import { store } from '../productsStore/Store';
import "../styles/OurBestSellers.css";
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-state/CartState';
import { Link } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const OurBestSellers = (props) => {
    const { title, price, id, image } = props;
    const dispatch = useDispatch();
    const toast = useToast();

    const addItemToCartHandler = (e) => {
        dispatch(
            cartActions.addItemToCart({
                id,
                price,
                title,
                image,
            })
        );
    }

    return (
        <div>
            <div key={id}>
                <div className="card w-96 bg-white-700 shadow-xl py-10">
                    <Link to={`/${id}`}>
                        <figure className="pt-6"> {/* Reduced padding */}
                            {/* Adjusted image size to one-third */}
                            <img src={image} alt={title} className="rounded-xl w-2/5 h-auto" />
                        </figure>
                    </Link>
                    <div className="card-body items-center text-center p-2"> {/* Reduced padding */}
                        <h2 className="card-title mb-1 font-bold text-xl">{title}</h2>
                        <h2 className="text-xl mb-2 fof">{price}</h2>
                        <div className="card-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    addItemToCartHandler();
                                    toast({
                                        title: '',
                                        description: "Successfully Added",
                                        status: 'success',
                                        duration: 1500,
                                        isClosable: true,
                                    });
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
}

export default OurBestSellers;
