import React, { useState } from "react";

const CancelOrderModal = ({ order, onClose }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Trạng thái để hiển thị thông báo thành công
  const API = process.env.REACT_APP_API_ENDPOINT;
  const reasons = [
    { id: "Sản phẩm không đúng", label: "Sản phẩm không đúng" },
    { id: "Không cần thiết nữa", label: "Không cần thiết nữa" },
    { id: "Sai màu sắc", label: "Sai màu sắc" },
    { id: "Không phù hợp", label: "Không phù hợp" },
    { id: "khac", label: "Lý do khác" },
  ];

  const handleCheckboxChange = (reasonId) => {
    if (reasonId === "khac") {
      setSelectedReasons([reasonId]);
      setOtherReason("");
    } else {
      setSelectedReasons((prev) =>
        prev.includes(reasonId)
          ? prev.filter((id) => id !== reasonId)
          : [...prev, reasonId]
      );
    }
  };

  const handleCancelOrder = () => {
    if (selectedReasons.length === 0) {
      alert("Vui lòng chọn lý do hủy đơn hàng.");
      return;
    }
    setShowConfirmation(true); 
  };

  const handleConfirmCancel = async () => {
    const reasonsToCancel = selectedReasons.includes("khac")
      ? [...selectedReasons, otherReason]
      : selectedReasons;

    const response = await fetch(`${API}/api/orders/${order.id}`, {
      method: "DELETE",
      body: JSON.stringify({ reason: reasonsToCancel.join(", ") }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau."); // Thông báo lỗi
      return;
    }

    setShowSuccessMessage(true); // Hiển thị thông báo thành công
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    onClose(); // Đóng modal chính khi thông báo được đóng
  };

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Hủy đơn hàng #{order.id}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Vui lòng chọn lý do bạn muốn hủy đơn hàng này:
                  </p>
                  <div className="mt-4">
                    {reasons.map((reason) => (
                      <div key={reason.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={reason.id}
                          checked={selectedReasons.includes(reason.id)}
                          onChange={() => handleCheckboxChange(reason.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={reason.id}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {reason.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedReasons.includes("khac") && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Nhập lý do khác..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                onClick={handleCancelOrder}
              >
                Hủy đơn
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={onClose}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xác Nhận */}
      {showConfirmation && (
        <ConfirmationModal
          orderId={order.id}
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelConfirmation}
        />
      )}

      {/* Modal Thông Báo Thành Công */}
      {showSuccessMessage && (
        <SuccessModal
          onClose={handleCloseSuccessMessage}
          orderId={order.id}
        />
      )}
    </>
  );
};

const ConfirmationModal = ({ onConfirm, onCancel, orderId }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Xác nhận hủy đơn hàng #{orderId}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn hủy đơn hàng này?
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
              onClick={onConfirm}
            >
              Xác nhận
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={onCancel}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ onClose, orderId }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Hủy đơn hàng thành công!
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Đơn hàng #{orderId} đã được hủy thành công.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
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

export default CancelOrderModal;