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
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addresses: [{}],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_ENDPOINT;
  const token = localStorage.getItem("token");
  const { state } = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

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
          throw new Error("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        }

        const data = await response.json();
        setUserInfo({
          ...data.user,
          addresses: data.addresses || [],
        });
      } catch (error) {
        setErrorMessage(error.message || "Đã xảy ra lỗi khi tải thông tin cá nhân.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [API, token, navigate]);

  const validPhonePrefixes = [
    '032', '033', '034', '035', '036', '037', '038', '039',
    '096', '097', '098', '086', '083', '084', '085', '081',
    '082', '088', '091', '094', '070', '079', '077', '076',
    '078', '090', '093', '089', '056', '058', '092', '059', '099'
  ];

  const validatePhoneNumber = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (!/^\d+$/.test(phoneNumber)) {
      return 'Số điện thoại chỉ chứa ký tự số';
    }

    if (cleanPhone.length !== 10) {
      return 'Số điện thoại phải có đúng 10 chữ số';
    }

    const prefix = cleanPhone.substring(0, 3);
    if (!validPhonePrefixes.includes(prefix)) {
      return 'Đầu số không hợp lệ';
    }

    return '';
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'firstName' || name === 'lastName' || name === 'city' || name === 'state') {
      if (!/^[\p{L}\s'-]+$/u.test(value)) {
        error = 'Trường này chỉ chứa các chữ cái, khoảng trắng, dấu gạch ngang và dấu nháy đơn';
      } else if (value.length < 2 || value.length > 50) {
        error = 'Trường này phải có từ 2 đến 50 ký tự';
      }
    } else if (name === 'email') {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = 'Email không đúng định dạng';
      }
    } else if (name === 'addressLine') {
      if (value.length < 5 || value.length > 100) {
        error = 'Địa chỉ phải có từ 5 đến 100 ký tự';
      }
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...userInfo.addresses];
    let error = '';

    if (field === 'phoneNumber') {
      error = validatePhoneNumber(value);
    } else {
      error = validateField(field, value);
    }

    const addressErrors = fieldErrors.addresses ? [...fieldErrors.addresses] : [];
    while (addressErrors.length <= index) {
      addressErrors.push({});
    }
    addressErrors[index] = {
      ...addressErrors[index],
      [field]: error,
    };

    setFieldErrors({
      ...fieldErrors,
      addresses: addressErrors,
    });

    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value,
    };
    setUserInfo({ ...userInfo, addresses: newAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(fieldErrors).some(
      (error) => typeof error === 'string' ? error : Object.values(error).some(err => err)
    );

    if (hasErrors) {
      alert("Vui lòng kiểm tra lại các thông tin trước khi lưu.");
      return;
    }

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

      navigate(state?.from || "/account");
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
              <label className="block text-sm font-medium text-gray-700">Họ</label>
              <input
                type="text"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <input
                type="text"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-bold">Địa chỉ của bạn</h3>
            <button
              type="button"
              onClick={() =>
                setUserInfo({
                  ...userInfo,
                  addresses: [
                    ...userInfo.addresses,
                    {
                      addressLine: "",
                      city: "",
                      state: "",
                      phoneNumber: "",
                      type: "home",
                    },
                  ],
                })
              }
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-opacity-30"
            >
              + Thêm địa chỉ mới
            </button>
          </div>

          {userInfo.addresses.map((address, index) => (
            <div
              key={index}
              className="p-4 mt-4 bg-gray-100 rounded-lg shadow-md border border-gray-200"
            >
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
                  {fieldErrors.addresses?.[index]?.addressLine && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.addresses[index].addressLine}
                    </p>
                  )}
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
                  {fieldErrors.addresses?.[index]?.city && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.addresses[index].city}
                    </p>
                  )}
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
                  {fieldErrors.addresses?.[index]?.state && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.addresses[index].state}
                    </p>
                  )}
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
                  {fieldErrors.addresses?.[index]?.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.addresses[index].phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
