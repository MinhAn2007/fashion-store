import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const ReviewModal = ({ orderId, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API}/api/reviews/order/${orderId}`);
        if (!response.ok) throw new Error("Error fetching reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
        setError("Không thể tải đánh giá.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999]" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-medium">Đang tải đánh giá...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999]" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-medium">{error}</h3>
            <button
              className="mt-4 text-gray-500 hover:bg-gray-200 transition-colors rounded-md px-4 py-2"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999]" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-medium">Không có đánh giá nào</h3>
            <button
              className="mt-4 text-gray-500 hover:bg-gray-200 transition-colors rounded-md px-4 py-2"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Đánh giá sản phẩm</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="h-6 w-6" />
            </button>
          </div>
          {reviews.map((review) => (
            <div key={review.id} className="my-4 p-4 border-b border-gray-200">
              <h4 className="font-semibold text-md">{review.title}</h4>
              <p className="text-gray-700">{review.content}</p>
              <p className="text-sm text-gray-500">Đánh giá: {review.rating} / 5</p>
            </div>
          ))}
          <button
            className="mt-4 w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
