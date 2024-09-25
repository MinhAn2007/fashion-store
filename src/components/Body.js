// import React, { useState } from 'react';
// import "../styles/Body.css";
// import { store } from '../productsStore/Store';
// import HoverImage from "react-hover-image/build";
// import { Link } from 'react-router-dom';

// const Body = () => {
//   const [activeContent, setActiveContent] = useState('bodyContent');

//   const handleMouseEnter = (content) => {
//     setActiveContent(content);
//   };

//   const handleMouseLeave = () => {
//     setActiveContent(null);
//   };

//   return (
//     <div>
//       <div className='categoryHold flex flex-col gap-14 font-normal absolute left-16 top-11'>
//         <div className='bodyHold lineHeight w-56 w56rem' onMouseEnter={() => handleMouseEnter('bodyContent')}>
//           <p className=' font-semibold hover-underline-animation'>BODY</p>
//         </div>
//         <div className='hairHold lineHeight w-56' onMouseEnter={() => handleMouseEnter('hairContent')}>
//           <p className=' font-semibold hover-underline-animation'>HAIR</p>
//         </div>
//         <div className='travelHold w-52 lineHeight' onMouseEnter={() => handleMouseEnter('travelContent')}>
//           <p className=' font-semibold hover-underline-animation'>TRAVEL</p>
//         </div>
//         <div className='newHold lineHeight' onMouseEnter={() => handleMouseEnter('newContent')}>
//           <p className=' font-semibold hover-underline-animation'>NEW</p>
//         </div>
//       </div>

//       {activeContent === 'bodyContent' && (
//         <div className='z-50 bodyContent color text-base' onMouseLeave={handleMouseLeave}>
//           <p>Body Wash</p>
//           <p>Body Scrub</p>
//           <p>Body Lotions</p>
//           <p>Body Oil</p>
//           <p>Hand Wash</p>
//           <p>Hand Creams</p>
//           <div className='bodyTypeHold flex'>
//             {store.map((item) => (
//               item.type === "navbar-BodyType" && (
//                 <Link to={`/${item.id}`} key={item.id}>
//                   <div className="bodyTypeIndivitual">
//                     <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className="rounded-xl bodyTypeImage" />
//                     <p className='text-center fs bodyTypeName'>{item.name}</p>
//                   </div>
//                 </Link>
//               )
//             ))}
//           </div>
//         </div>
//       )}

//       {activeContent === 'hairContent' && (
//         <div className='z-50 hairContent flex flex-col' onMouseLeave={handleMouseLeave}>
//           <div className='hairTypeCategoryONE flex flex-col gap-8'>
//             <p className='font-bold text-xl'>CATEGORY</p>
//             <p>Shampoos</p>
//             <p>Conditioners</p>
//             <p>Treatments</p>
//           </div>
//           <div className='hairTypeCategoryTWO flex-col flex gap-10'>
//             <p className='font-bold'>HAIR CONCERN</p>
//             <p>Deep Cleanse</p>
//             <p>Oily</p>
//             <p>Dry</p>
//             <p>Volume</p>
//             <p>Normal</p>
//           </div>
//           <div className='hairImageHold flex flex-row gap-10'>
//             <img src='https://cdn.shopify.com/s/files/1/0081/7374/8305/articles/Natural_Balance_Shampoo_02_540x.jpg?v=1550710011' className='rounded-xl w-52' alt='Shampoo' />
//             <img src='https://cdn.shopify.com/s/files/1/0081/7374/8305/articles/ee7ea9c87918e493665a3a84bdf6c00a_large_1b25100f-7d60-451b-9d01-e74d104141d5_540x.jpg?v=1550710009' className='rounded-xl w-52' alt='Conditioner' />
//           </div>
//           <div className='hairTextHold flex flex-row relative font-semibold'>
//             <p className='flex flex-row flex-wrap w-56'>Make The Switch! Why Natural Haircare Is Best</p>
//             <p className='flex flex-row flex-wrap w-56'>How to lead a natural & sustainable lifestyle</p>
//           </div>
//         </div>
//       )}

//       {activeContent === 'travelContent' && (
//         <div className='z-50 travelContent' onMouseLeave={handleMouseLeave}>
//           <div className='flex flex-row'>
//             <div className='TravelStoreHold flex flex-row gap-16'>
//               {store.map((item) => (
//                 item.type === "navbar-TravelType" && (
//                   <Link to={`/${item.id}`} key={item.id}>
//                     <div className="TravelIndivitual">
//                       <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className="rounded-xl w-40" />
//                       <p className='font-semibold text-base px'>{item.name}</p>
//                       <p className='text-base font-normal text-center'>${item.price}</p>
//                     </div>
//                   </Link>
//                 )
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {activeContent === 'newContent' && (
//         <div className='newContent relative left-72 text-base text-gray-500 top-16' onMouseLeave={handleMouseLeave}>
//           <div className='newCategoryHold flex flex-col gap-9'>
//             <p className='font-bold text-xl'>CATEGORY</p>
//             <p>Brightening Range</p>
//             <p>Facial Masks</p>
//             <p>Rosehip Range</p>
//             <p>Shop All New Arrivals</p>
//           </div>
//           <div className='newTypeHold relative flex flex-row gap-10'>
//             {store.map((item) => (
//               item.type === "navbar-NewType" && (
//                 <Link to={`/${item.id}`} key={item.id}>
//                   <div className='newIndivitual'>
//                     <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className="rounded-xl w-40" />
//                     <p className='font-semibold text-center text-base px'>{item.name}</p>
//                     <p className='text-base font-normal text-center'>${item.price}</p>
//                   </div>
//                 </Link>
//               )
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Body;
