import React from 'react'
import "../styles/HeroSection.css"
import one from "../assets/one.png"
import two from "../assets/two.png"
import three from "../assets/three.png"


const HeroSection = () => {
    return (
        <div className='heroSecMainParent'>

            <p className='text-4xl mt-20 text-center welcomStore'>HEY! FIND YOUR STYLE.</p>
            <br />
            <br />


            <p className='heroDescription relative text-xl flex flex-wrap'> If you don't conform to the way others dress, you don't have to conform to their way of thinking. </p>


            <div className='heroPicHold flex flex-row '>
                <img src={one} className=" w-20 " />
                <img src={two} className=" w-20" />
                <img src={three} className=" w-20" />
            </div>

            <div className=' text-xl font-medium flex flex-row heroHeadingHold'>
                <p> Made to Last </p>
                <p> Crafted for Comfort </p>
                <p> Soft on Your Skin </p>
            </div>

            <div className='heroDescHold flex-row flex relative text-base font-normal'>
                <p> Our jeans are crafted with durable fabrics and meticulous stitching, ensuring they stand the test of time.  </p>
                <p> Our shirts are designed with your comfort in mind. We use soft, breathable fabrics and tailored cuts for a perfect fit. </p>
                <p> Our shirts are made from gentle, skin-friendly fabrics that feel luxurious against your skin. Enjoy ultimate comfort and a soft touch. </p>
            </div>
        </div>
    )
}

export default HeroSection