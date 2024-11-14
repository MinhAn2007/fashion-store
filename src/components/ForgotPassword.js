import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setMessage("Tính năng quên mật khẩu hiện đang được phát triển. Vui lòng thử lại sau.");
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

                {message && <p className="text-green-600 text-center">{message}</p>}

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
                        className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none"
                    >
                        Gửi yêu cầu
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