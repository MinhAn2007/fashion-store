import React, { useEffect, useState } from "react";
import { formatPrice } from "../utils/utils.js";

const ResultVNPAYPage = () => {
  const [paymentInfo, setPaymentInfo] = useState({});
  const [message, setMessage] = useState("");
  const API = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    // Lấy các tham số từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const responseCode = urlParams.get("vnp_ResponseCode");
    const transactionId = urlParams.get("vnp_TransactionNo");
    const amount = urlParams.get("vnp_Amount");
    const orderInfo = urlParams.get("vnp_OrderInfo");
    const transactionStatus = urlParams.get("vnp_TransactionStatus");
    const txnRef = urlParams.get("vnp_TxnRef");
    setPaymentInfo({
      responseCode,
      transactionId,
      amount,
      orderInfo,
      transactionStatus,
      txnRef,
    });

    // Nếu giao dịch thành công, gọi API tạo đơn hàng
    if (responseCode === "00") {
      createOrder(transactionId, amount, orderInfo);
    } else {
      setMessage("Giao dịch không thành công. Vui lòng thử lại.");
    }
  }, []);

  const createOrder = async (transactionId, amount, orderInfo) => {
    try {
      const data = JSON.parse(localStorage.getItem("orderData"));
      const response = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Đơn hàng đã được tạo thành công!");
      } else {
        console.log(response);
        setMessage("Đã xảy ra lỗi khi tạo đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API tạo đơn hàng:", error);
      setMessage("Đã xảy ra lỗi khi tạo đơn hàng.");
    }
  };

  return (
    <div className="min-h-[600px] flex justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-fit mt-20">
        <h2 className="text-2xl font-semibold mb-4">Kết quả giao dịch</h2>
        <p className="mb-2">Mã giao dịch: {paymentInfo.transactionId}</p>
        <p className="mb-2">
          Số tiền: <span>{formatPrice(paymentInfo.amount * 0.01)}</span>
        </p>
        <p className="mb-2">Thông tin: {paymentInfo.orderInfo}</p>
        <p className="mb-2">
          Trạng thái giao dịch:{" "}
          <span
            className={
              paymentInfo.transactionStatus === "00"
                ? "text-green-500 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {paymentInfo.transactionStatus === "00"
              ? "Thành công"
              : "Không thành công"}
          </span>
        </p>
        <p className="mb-2">Mã tham chiếu giao dịch: {paymentInfo.txnRef}</p>
        <p className="text-lg font-semibold text-blue-600">{message}</p>
        {message && (
          <div className="flex justify-center mt-4">
            <a
              href="/"
              className="text-black hover:underline text-lg font-semibold"
            >
              Quay lại trang chủ
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultVNPAYPage;