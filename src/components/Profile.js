import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthWithCheck } from "../hooks/useAuth";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const API = process.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();
  const { checkApiResponse } = useAuthWithCheck();
  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await fetch(`${API}/api/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        checkApiResponse(response);

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        }

        const data = await response.json();
        setUserInfo(data);
        console.log(data);

      } catch (error) {
        setErrorMessage(error.message || "Đã xảy ra lỗi khi tải thông tin cá nhân.");
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [API, token, navigate]);
  console.log(userInfo);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center mx-auto">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        <p className="ml-4 text-gray-700">Đang tải thông tin...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full  h-fit bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Thông tin cá nhân
        </h2>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ</label>
              <p className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2">
                {userInfo?.user.firstName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <p className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2">
                {userInfo?.user.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-2">
                {userInfo?.user.email}
              </p>
            </div>
          </div>

          {/* Address Section */}
          <h3 className="text-xl font-bold mt-8">Địa chỉ của bạn</h3>
          {userInfo?.addresses && userInfo.addresses.length > 0 ? (
            userInfo.addresses.map((address, index) => (
              <div key={index} className="p-4 mt-4 bg-gray-100 rounded-lg shadow-md border border-gray-200">
                <p>
                  <strong>Địa chỉ :</strong>
                </p>
                <p>Địa chỉ: {address.addressLine}</p>
                <p>Thành phố: {address.city}</p>
                <p>Tỉnh/Thành phố: {address.state}</p>
                <p>Số điện thoại: {address.phoneNumber}</p>
              </div>
            ))
          ) : (
            <p className="mt-4 text-gray-600">Bạn chưa thêm địa chỉ nào.</p>
          )}

          {/* Edit Profile Button */}

          {/* <button
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            onClick={() => navigate("/edit-profile")}
          >
            Chỉnh sửa thông tin
          </button> */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Chỉnh sửa thông tin
          </button>


        </div>
      </div>
    </div>
  );
};

export default Profile;
