import React from 'react';
import fbicon from "../assets/fbicon.png";
import insgicon from "../assets/insgicon.png";
import shopeeicon from "../assets/shopeeicon.png";

const SPFooter = () => {
    return (
        <footer className="bg-gray-900">
            <div className="container mx-auto py-12 px-4">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-white">Dịch vụ</h3>
                        <ul className="text-white">
                            <li><a href="#" className="hover:underline text-white">Giới thiệu</a></li>
                            <li><a href="#" className="hover:underline text-white">Chăm sóc khách hàng</a></li>
                            <li><a href="#" className="hover:underline text-white">Vận chuyển & Đổi trả</a></li>
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-white">Liên hệ</h3>
                        <p className="text-white">voongocminhan20072002@gmail.com</p>
                        <p className="text-white">longsky0912624119@gmail.com</p>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-white">Mạng xã hội</h3>
                        <div className="flex space-x-4">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={fbicon} alt="facebook" className="h-6 w-6" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={insgicon} alt="instagram" className="h-6 w-6" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img src={shopeeicon} alt="shopee" className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-6">
                        <h3 className="font-bold text-lg mb-2 text-white">Địa chỉ</h3>
                        <p className="text-white">12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Hồ Chí Minh</p>
                    </div>
                </div>
                <div className="text-center pt-6 text-white border-t border-gray-300">
                    Copyright © 2024 A&L Store
                </div>
            </div>
        </footer>
    );
};

export default SPFooter;