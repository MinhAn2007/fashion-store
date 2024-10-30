import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { formatPrice } from "../utils/utils";

const ProductReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state;
    console.log(cartItems);
    
  const [reviews, setReviews] = useState(
    cartItems.map((item) => ({
      productId: item.productId,
      rating: 0,
      comment: "",
      file: null,
      images: [],
      video: null,
    }))
  );

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const handleRatingChange = (index, value) => {
    setReviews((prev) =>
      prev.map((review, i) =>
        i === index ? { ...review, rating: value } : review
      )
    );
  };

  const handleCommentChange = (index, value) => {
    setReviews((prev) =>
      prev.map((review, i) =>
        i === index ? { ...review, comment: value } : review
      )
    );
  };

  const handleFileUpload = (index, file) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? file : f)));
    setReviews((prev) =>
      prev.map((review, i) => (i === index ? { ...review, file } : review))
    );
  };

  const handleImageUpload = (index, imageList) => {
    setImages((prev) =>
      prev.map((imgList, i) => (i === index ? imageList : imgList))
    );
    setReviews((prev) =>
      prev.map((review, i) =>
        i === index ? { ...review, images: imageList } : review
      )
    );
  };

  const handleVideoUpload = (index, video) => {
    setVideos((prev) => prev.map((v, i) => (i === index ? video : v)));
    setReviews((prev) =>
      prev.map((review, i) => (i === index ? { ...review, video } : review))
    );
  };

  const handleSubmit = () => {
    const reviewData = reviews.map((review, index) => ({
      ...review,
      file: files[index],
      images: images[index],
      video: videos[index],
    }));

    // Logic to submit reviews
    console.log(reviewData);
    navigate("/order-history");
  };

  const Rating = ({ value, onChange, icon }) => {
    const handleMouseEnter = (index) => {
      onChange(index + 1);
    };

    const handleMouseLeave = () => {
      onChange(value);
    };

    const handleClick = (index) => {
      onChange(index + 1);
    };

    return (
      <div onMouseLeave={handleMouseLeave} className="flex gap-1">
        {[...Array(5)].map((_, index) => {
          const star =
            value > index
              ? value - index >= 1
                ? icon.full
                : icon.half
              : icon.empty;

          return (
            <span
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
              className="cursor-pointer"
            >
              {star}
            </span>
          );
        })}
      </div>
    );
  };
  console.log(cartItems);
  
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Đánh giá sản phẩm của đơn hàng #{cartItems[0].orderId}</h1>
      {cartItems.map((item, index) => (
        <div
          key={item.id}
          className="p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{item.productName}</h3>
              <p className="text-gray-600">
                Size: {item.size} - Màu: {item.color}
              </p>
              <p className="text-gray-900 font-semibold">
                {formatPrice(item.cartItemPrice)}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor={`rating-${index}`}
              className="block text-gray-700 font-medium mb-1"
            >
              Đánh giá:
            </label>
            <Rating
              id={`rating-${index}`}
              value={reviews[index].rating}
              onChange={(value) => handleRatingChange(index, value)}
              icon={{
                full: <BsStarFill className="w-6 h-6 text-yellow-400" />,
                half: <BsStarHalf className="w-6 h-6 text-yellow-400" />,
                empty: <BsStar className="w-6 h-6 text-gray-300" />,
              }}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor={`comment-${index}`}
              className="block text-gray-700 font-medium mb-1"
            >
              Bình luận:
            </label>
            <textarea
              id={`comment-${index}`}
              rows={3}
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              value={reviews[index].comment}
              onChange={(e) => handleCommentChange(index, e.target.value)}
            ></textarea>
          </div>

          <div className="mt-4">
            <label
              htmlFor={`image-${index}`}
              className="block text-gray-700 font-medium mb-1"
            >
              Tải lên hình ảnh:
            </label>
            <input
              id={`image-${index}`}
              type="file"
              multiple
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              onChange={(e) =>
                handleImageUpload(index, Array.from(e.target.files))
              }
            />
            {images[index]?.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images[index].map((image, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded Image ${imageIndex}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor={`video-${index}`}
              className="block text-gray-700 font-medium mb-1"
            >
              Tải lên video:
            </label>
            <input
              id={`video-${index}`}
              type="file"
              accept="video/*"
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              onChange={(e) => handleVideoUpload(index, e.target.files[0])}
            />
            {videos[index] && (
              <div className="mt-2">
                <span className="font-medium">Video đã tải lên:</span>
                <video
                  controls
                  className="w-full h-48 object-cover rounded-md mt-2"
                >
                  <source
                    src={URL.createObjectURL(videos[index])}
                    type="video/mp4"
                  />
                  Trình duyệt không hỗ trợ xem video.
                </video>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          className="bg-black text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={handleSubmit}
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
};

export default ProductReview;
