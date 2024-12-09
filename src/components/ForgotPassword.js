import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage(null); // Xóa thông báo cũ

        if (!isValidEmail(email)) {
            setMessage("Địa chỉ email không hợp lệ.");
            return;
        }

        setLoading(true); // Bắt đầu loading

        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.");
            }

            const data = await response.json();
            setMessage(data.message); // Hiển thị thông báo từ backend
        } catch (error) {
            setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
            console.error("Error in ForgotPassword:", error.message);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Quên mật khẩu
                </h2>

                <p className="text-gray-600 text-sm text-center mb-4">
                    Nhập email bạn đã dùng để đăng ký tài khoản. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn.
                </p>

                {message && (
                    <p
                        className={`text-center ${message.toLowerCase().includes("lỗi")
                            ? "text-red-600"
                            : "text-green-600"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                            Quay về trang chủ
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        Bạn chưa có tài khoản?{" "}
                        <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
