import React, { useEffect, useState } from "react";
import { FiX, FiStar } from "react-icons/fi";

const ReviewModal = ({ order, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API}/api/reviews/order/${order.id}`);
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
  }, [API, order.id]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="relative w-full max-w-4xl transform rounded-xl bg-white shadow-2xl transition-all">
          <div className="p-6 text-center">
            <div className="animate-pulse">
              <h3 className="text-lg font-semibold text-gray-600">
                Đang tải đánh giá...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="relative w-full max-w-4xl transform rounded-xl bg-white shadow-2xl transition-all">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-4">{error}</h3>
            <button
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-4xl transform rounded-xl bg-white shadow-2xl transition-all">
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Đánh giá sản phẩm</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Sản phẩm: {review.name}</h4>
                      <div className="flex space-x-1">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-700 mb-3">Nội dung: {review.content}</p>
                    
                    {review.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-between">
                        {review.images.map((image, index) => (
                          <div key={index} className="w-52 h-48 relative flex">
                            <img
                              src={image}
                              alt={`Review Image ${index + 1}`}
                              className="rounded-lg w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}


                    {review.video && (
                      <video 
                        controls 
                        className="w-full rounded-lg mt-3"
                        preload="metadata"
                      >
                        <source src={review.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    
                    <div className="mt-3 text-right">
                      <span className="text-sm text-gray-500">
                        {review.rating} / 5 sao
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Chưa có đánh giá nào.</p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
            <button
              className="w-full bg-black text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition-colors font-semibold shadow-sm"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;