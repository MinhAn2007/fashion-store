import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { formatPrice } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const ProductReview = () => {
  const navigate  = useNavigate();

  const location = useLocation();
  const { cartItems } = location.state;
  const API = process.env.REACT_APP_API_ENDPOINT;
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const [reviews, setReviews] = useState(
    cartItems.map((item) => ({
      productId: item.productId,
      rating: 0,
      comment: "",
      images: [],
      video: null,
    }))
  );

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const uploadToS3 = async (file, userId, fileType = "image") => {
    try {
      const formData = new FormData();
      formData.append(fileType, file);

      const response = await fetch(`${API}/api/uploadAvatarS3/${userId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${fileType}`);
      }

      const data = await response.json();
      return data.avatar;
    } catch (error) {
      console.error(`Upload ${fileType} error:`, error);
      throw error;
    }
  };

  const validateReview = (review) => {
    if (!review.rating || review.rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return false;
    }

    if (
      review.rating < 3 &&
      (!review.comment || review.comment.trim() === "")
    ) {
      alert("Vui lòng nhập nội dung đánh giá cho đánh giá dưới 3 sao");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const isValid = reviews.every(validateReview);
    if (!isValid) return;

    setIsLoading(true);

    try {
      for (const review of reviews) {
        const reviewData = {
          productId: review.productId,
          userId: userId,
          rating: review.rating,
          content: review.comment,
          title: name,
          images: [],
          video: null,
        };

        if (review.images && review.images.length > 0) {
          const imageUrls = await Promise.all(
            review.images.map((image) => uploadToS3(image, userId, "image"))
          );
          reviewData.images = imageUrls;
        }

        // Tải video lên và thêm vào reviewData
        if (review.video) {
          const videoUrl = await uploadToS3(review.video, userId, "image");
          reviewData.video = videoUrl;
        }
        console.log(reviewData);  
        
        // Gửi đánh giá
        const reviewResponse = await fetch(`${API}/api/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: reviewData.productId,
            userId,
            rating: reviewData.rating,
            content: reviewData.content,
            images: JSON.stringify(reviewData.images),
            video: JSON.stringify(reviewData.video),
            title: `${name}`, 
            orderId: cartItems[0].orderId
          }),
        });

        if (!reviewResponse.ok) {
          throw new Error("Failed to submit review");
        }
      }
      alert("Đánh giả của bạn đã được gửi thành công, bạn có thể xem lại lịch sử mua hàng của mình");
      navigate("/history");

    } catch (error) {
      console.error("Error submitting reviews:", error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        Đánh giá sản phẩm của đơn hàng #{cartItems[0].orderId}
      </h1>
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
              <div className="mt-2">
                <p className="font-medium">Hình ảnh đã chọn:</p>
                <div className="flex gap-2">
                  {images[index].map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
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
              <video
                controls
                className="mt-2 w-full h-48 object-cover rounded-md"
                src={URL.createObjectURL(videos[index])}
              />
            )}
          </div>
        </div>
      ))}

      {/* Step 3: Conditionally render loading indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="text-lg text-gray-700">Đang gửi đánh giá...</span>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-30 transition duration-200"
        >
          Gửi Đánh Giá
        </button>
      )}
    </div>
  );
};

export default ProductReview;
