import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addresses: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_ENDPOINT;
  const token = localStorage.getItem("token");
  const { state } = useLocation();
  console.log(state?.from);

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

        if (!response.ok) {
          throw new Error(
            "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại."
          );
        }

        const data = await response.json();
        setUserInfo({
          ...data.user,
          addresses: data.addresses || [],
        });
      } catch (error) {
        setErrorMessage(
          error.message || "Đã xảy ra lỗi khi tải thông tin cá nhân."
        );
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...userInfo.addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value,
    };
    setUserInfo({ ...userInfo, addresses: newAddresses });
  };

  const addNewAddress = () => {
    const newAddress = {
      addressLine: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phoneNumber: "",
      type: "home",
    };
    setUserInfo({
      ...userInfo,
      addresses: [...userInfo.addresses, newAddress],
    });
  };

  const removeAddress = (index) => {
    const newAddresses = userInfo.addresses.filter((_, idx) => idx !== index);
    setUserInfo({ ...userInfo, addresses: newAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thông tin không thành công");
      }
      if (state?.from) {
        navigate(state.from);
      } else {
        navigate("/account");
      }
    } catch (error) {
      setErrorMessage(error.message || "Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

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
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Chỉnh sửa thông tin cá nhân
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ
              </label>
              <input
                type="text"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                type="text"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-bold">Địa chỉ của bạn</h3>
            <button
              type="button"
              onClick={addNewAddress}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              + Thêm địa chỉ mới
            </button>
          </div>

          {userInfo.addresses.map((address, index) => (
            <div
              key={index}
              className="p-4 mt-4 bg-gray-100 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Địa chỉ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAddress(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ chi tiết:
                  </label>
                  <input
                    type="text"
                    value={address.addressLine || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "addressLine", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thành phố:
                  </label>
                  <input
                    type="text"
                    value={address.city || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "city", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tỉnh:
                  </label>
                  <input
                    type="text"
                    value={address.state || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "state", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quốc gia:
                  </label>
                  <input
                    type="text"
                    value={address.country || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "country", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã bưu điện:
                  </label>
                  <input
                    type="text"
                    value={address.postalCode || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "postalCode", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại:
                  </label>
                  <input
                    type="tel"
                    value={address.phoneNumber || ""}
                    onChange={(e) =>
                      handleAddressChange(index, "phoneNumber", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại địa chỉ:
                  </label>
                  <select
                    value={address.type || "home"}
                    onChange={(e) =>
                      handleAddressChange(index, "type", e.target.value)
                    }
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  >
                    <option value="Nhà riêng">Nhà riêng</option>
                    <option value="Công ty">Công ty</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
