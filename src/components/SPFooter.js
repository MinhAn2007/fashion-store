import React, { useState } from 'react';
import fbicon from "../assets/fbicon.png";
import insgicon from "../assets/insgicon.png";
import shopeeicon from "../assets/shopeeicon.png";

const SPFooter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Xử lý khi nhấn nút "Đăng ký"
    const handleSubscribe = (e) => {
        e.preventDefault();
        if (validateEmail(email)) {
            setMessage('Đăng ký nhận tin thành công!');
            setEmail(''); // Reset email input
        } else {
            setMessage('Vui lòng nhập email hợp lệ.');
        }
    };

    return (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between mb-8">
                    {/* Dịch vụ */}
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-4 text-white">Dịch vụ</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-white hover:underline hover:text-gray-400">Giới thiệu</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-400">Chăm sóc khách hàng</a></li>
                            <li><a href="#" className="text-white hover:underline hover:text-gray-400">Vận chuyển & Đổi trả</a></li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
                        <p>voongocminhan20072002@gmail.com</p>
                        <p>longsky0912624119@gmail.com</p>
                    </div>

                    {/* Mạng xã hội */}
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-4">Mạng xã hội</h3>
                        <div className="flex space-x-6">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition duration-300">
                                <img src={fbicon} alt="facebook" className="h-8 w-8" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition duration-300">
                                <img src={insgicon} alt="instagram" className="h-8 w-8" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition duration-300">
                                <img src={shopeeicon} alt="shopee" className="h-8 w-8" />
                            </a>
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-4">Địa chỉ</h3>
                        <p>12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Hồ Chí Minh</p>
                    </div>
                </div>

                {/* Form đăng ký nhận tin */}
                <div className="text-center bg-gray-800 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-lg mb-2 text-white">Đăng ký nhận tin</h4>
                    <p className="text-sm text-gray-400 mb-4">Nhận thông tin về khuyến mãi và sản phẩm mới nhất</p>
                    <form className="flex justify-center space-x-2" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-r-lg hover:bg-green-600 transition duration-300"
                        >
                            Đăng ký
                        </button>
                    </form>
                    {/* Hiển thị thông báo */}
                    {message && <p className="text-sm mt-4 text-yellow-400">{message}</p>}
                </div>

                {/* Copyright */}
                <div className="text-center pt-6 text-gray-400 border-t border-gray-700">
                    Copyright © 2024 A&L Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default SPFooter;
