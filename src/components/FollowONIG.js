/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import "../styles/FollowONIG.css";
import "react-alice-carousel/lib/alice-carousel.css";
import { ExternalLink } from 'react-external-link';
import Marquee from "react-fast-marquee";


const FollowONIG = () => {

  const responsive = {
    2000: {
      items: 11,
    },
    1600: {
      items: 6
    },
    1200: {
      items: 5,
    },
    800: {
      items: 3,
    },
    0: {
      items: 1,
    },
  };

  return (
    <div className=' flex flex-col my-24 flex-center'>
      <h1 className='text-center font-bold text-4xl italic'> FOLLOW US ON INSTAGRAM </h1>


        <Marquee pauseOnHover={true} speed={100}  className='mt-24'>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en' >
            <img src="https://thorstore.vn/upload/hinhthem/fb02c74bb67f4c8bb79c44e632ef6849-26526734_400x530.jpeg" className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/80dab4476608439db64db504b18db333-99805030_400x530.jpeg" className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/d681e2ef09db49ed9ebb646459ac6ed9-85926019_400x530.jpeg" className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/c182cb2f10d34d34ae09152d631546ce-87043395_400x530.jpeg" className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/597220dee9ac464a9dfefadbbeb127ee-95987452_400x530.jpeg" className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/e7a2634520a042bdba1cdb0fddd5fbb9-59858297_400x530.jpeg" className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/521e10a13467460786859e8a261cca2f-71266275_400x530.jpeg" className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/fc15db2758754b4cb6fd5a478a0a00ed-14947881_400x530.jpeg" className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/8d8f552295c3494d91b7a19da37e976c-84309982_400x530.jpeg" className=' w-60 rounded-2xl  mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/5ee071410a8e4168aa2fcc6e9a0c67ee-14564973_400x530.jpeg" className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://www.instagram.com/hey.thorstore/?hl=en'>
            <img src="https://thorstore.vn/upload/hinhthem/072dd00c1aff4593bf01cd9dcb477b6c-24360794_400x530.jpeg" className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

        </Marquee>
      </div>

  )
}

export default FollowONIG
