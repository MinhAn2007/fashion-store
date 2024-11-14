import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const API = process.env.REACT_APP_API_ENDPOINT;
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const response = await fetch(`${API}/api/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) throw new Error("Token không hợp lệ hoặc đã hết hạn.");

            setMessage("Mật khẩu của bạn đã được đặt lại thành công.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đặt lại mật khẩu
                </h2>
                {message && <p className="text-green-600 text-center">{message}</p>}
                {error && <p className="text-red-600 text-center">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="block w-full px-3 py-2 border rounded"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            className="block w-full px-3 py-2 border rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-black text-white rounded">
                        Đặt lại mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
