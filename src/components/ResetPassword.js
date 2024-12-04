import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const API = process.env.REACT_APP_API_ENDPOINT;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/forgot-password");
        }
    }, [token, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true); // Bắt đầu trạng thái loading

        if (newPassword.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            setLoading(false); // Kết thúc loading
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false); // Kết thúc loading
            return;
        }

        try {
            const response = await fetch(`${API}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/forgot-password");
                }
                throw new Error("Token không hợp lệ hoặc đã hết hạn.");
            }

            const data = await response.json();
            setMessage(data.message || "Mật khẩu của bạn đã được đặt lại thành công.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đặt lại mật khẩu
                </h2>
                {message && (
                    <p className="text-green-600 text-center">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="text-red-600 text-center">
                        {error}
                    </p>
                )}
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
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-black text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
