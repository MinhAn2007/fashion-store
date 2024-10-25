import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API = process.env.REACT_APP_API_ENDPOINT;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true }); // Redirect to home if logged in
    }
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.token;
      const totalCartQuantity = data.user.totalCartQuantity; // Assuming your API returns this
      const userId = data.user.userId;

      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("cartQuantity", totalCartQuantity); // Save cart quantity

      setSuccessMessage("Đăng nhập thành công!"); // Set success message

      const from = location.state?.from?.pathname || "/";
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500); // Redirect after 1.5 seconds
    } catch (error) {
      console.error("Authentication failed:", error);
      localStorage.removeItem("token");
      setErrorMessage(
        error.message || "Authentication failed. Please try again."
      );
      setSuccessMessage(null); // Clear success message on error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div>
          <Link to="/" className=" text-black flex">
            <IoMdArrowBack className="my-auto mr-2" /> Quay về trang chủ
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản của bạn tiếp tục
          </h2>
        </div>
        {successMessage && (
          <div className="text-green-600 text-center mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4">{errorMessage}</div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Nhấn vào đây để đăng ký
            </Link>
          </p>
        </div>
      </div>

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" />
                <path className="opacity-75" d="M4 12h16M12 4v16" />
              </svg>
            </div>
            <p className="text-gray-700">Đang đăng nhập, vui lòng chờ...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
