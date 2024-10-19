import React from 'react'
import better from "../assets/better.jpeg";
import mastercard from "../assets/mastercard.png";
import { FaShippingFast } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaCcPaypal } from "react-icons/fa";
import { FaCcStripe } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md"; 




const CartAdditonalFeatures = () => {
    return (
        <div className=' flex gap-12 flex-row relative'>
            <FaCcVisa className=' w-96 h-24' />
            <FaCcPaypal className=' w-96 h-24' />
            <FaCcMastercard className=' w-96 h-24' />
            <MdAttachMoney className=' w-96 h-24' />
        </div>
    )
}

export default CartAdditonalFeatures