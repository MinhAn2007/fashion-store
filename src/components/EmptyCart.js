import React from 'react'
import cartgif from "../assets/cartGif.gif";
import "../styles/BestSellers.css";


const EmptyCart = () => {
    return (
        <div className=' emptyCartMainParent text-center relative top-20 h-full'>

            <div id='fs'>
                <p className=' text-3xl fof ' id='fs'>Mua hàng đi bạn ei !!!!! </p>
            </div>

            <img src={cartgif} className=" absolute cg" />
        </div>
    )
}

export default EmptyCart