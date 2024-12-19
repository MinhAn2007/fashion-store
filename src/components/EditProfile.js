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

  // Sử dụng fallback an toàn cho cartItems
  const cartItems = state?.cartItems || [];
  console.log("cartItems:", cartItems);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Fetch provinces when component mounts
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const data = await response.json();
        if (data.error === 0) {
          setProvinces(data.data);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);
  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      const data = await response.json();
      if (data.error === 0) {
        setDistricts(data.data);
        setWards([]); // Reset wards when province changes
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // New method to fetch wards based on selected district
  const fetchWards = async (districtId) => {
    try {
      const response = await fetch(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );
      const data = await response.json();
      if (data.error === 0) {
        setWards(data.data);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [API, token, navigate]);

  const validPhonePrefixes = [
    "032",
    "033",
    "034",
    "035",
    "036",
    "037",
    "038",
    "039",
    "096",
    "097",
    "098",
    "086",
    "083",
    "084",
    "085",
    "081",
    "082",
    "088",
    "091",
    "094",
    "070",
    "079",
    "077",
    "076",
    "078",
    "090",
    "093",
    "089",
    "056",
    "058",
    "092",
    "059",
    "099",
  ];

  const validatePhoneNumber = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (!/^\d+$/.test(phoneNumber)) {
      return "Số điện thoại chỉ chứa ký tự số";
    }

    if (cleanPhone.length !== 10) {
      return "Số điện thoại phải có đúng 10 chữ số";
    }

    const prefix = cleanPhone.substring(0, 3);
    if (!validPhonePrefixes.includes(prefix)) {
      return "Đầu số không hợp lệ";
    }

    return "";
  };

  const validateField = (name, value) => {
    let error = "";
    if (
      name === "firstName" ||
      name === "lastName" ||
      name === "city" ||
      name === "state"
    ) {
      if (!/^[\p{L}\s'-]+$/u.test(value)) {
        error =
          "Trường này chỉ chứa các chữ cái, khoảng trắng, dấu gạch ngang và dấu nháy đơn";
      } else if (value.length < 2 || value.length > 50) {
        error = "Trường này phải có từ 2 đến 50 ký tự";
      }
    } else if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Email không đúng định dạng";
      }
    } else if (name === "addressLine") {
      if (value.length < 5 || value.length > 100) {
        error = "Địa chỉ phải có từ 5 đến 100 ký tự";
      }
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (index, field, value, additionalData = {}) => {
    const newAddresses = [...userInfo.addresses];
    let error = "";

    // Existing validation for other fields
    if (field === "phoneNumber") {
      error = validatePhoneNumber(value);
    } else {
      error = validateField(field, value);
    }
    if (value === "") {
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: "", // Gán giá trị rỗng thay vì undefined
      };
    }
    // Handle special address-related fields
    if (field === "province") {
      fetchDistricts(value);
      newAddresses[index] = {
        ...newAddresses[index],
        provinceId: value,
        provinceName: additionalData.name,
        districtId: null,
        wardId: null,
      };
    } else if (field === "district") {
      fetchWards(value);
      newAddresses[index] = {
        ...newAddresses[index],
        districtId: value,
        districtName: additionalData.name,
        wardId: null,
      };
    } else if (field === "ward") {
      newAddresses[index] = {
        ...newAddresses[index],
        wardId: value,
        wardName: additionalData.name,
      };
    } else {
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: value,
      };
    }

    // Update errors
    const addressErrors = fieldErrors.addresses
      ? [...fieldErrors.addresses]
      : [];
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

    console.log("newAddresses:", newAddresses);
    setUserInfo({ ...userInfo, addresses: newAddresses });
  };
  const handleDeleteAddress = async (index) => {
    const addressId = userInfo.addresses[index].id;

    if (!addressId) {
      setUserInfo((prevUserInfo) => {
        const newAddresses = [...prevUserInfo.addresses];
        newAddresses.splice(index, 1);
        return { ...prevUserInfo, addresses: newAddresses };
      });
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/users/me/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Xóa địa chỉ không thành công");
      }

      setUserInfo((prevUserInfo) => {
        const newAddresses = prevUserInfo.addresses.filter(
          (_, i) => i !== index
        );
        return { ...prevUserInfo, addresses: newAddresses };
      });

      alert("Xóa địa chỉ thành công!");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Có lỗi xảy ra khi xóa địa chỉ.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasGeneralErrors = Object.values(fieldErrors).some(
      (error) => typeof error === "string" && error !== ""
    );

    const hasAddressErrors = fieldErrors.addresses.some(
      (addressError) =>
        addressError &&
        Object.values(addressError).some((err) => err && err !== "")
    );

    if (hasGeneralErrors || hasAddressErrors) {
      alert("Vui lòng kiểm tra lại các thông tin trước khi lưu.");
      return;
    }

    const newAddressMap =  userInfo.addresses.map((address) => {
      address.city = address.districtName;
      address.state = address.provinceName;
      address.addressLine = `${address.addressLine} ${address.wardName}` || "";
      return address;
    });

    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      addresses: newAddressMap,
    }));

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

      alert("Cập nhật thông tin thành công!");
      navigate(state?.from || "/account", {
        state: {
          cartItems: cartItems,
        },
      });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
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
              {fieldErrors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.firstName}
                </p>
              )}
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
              {fieldErrors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.lastName}
                </p>
              )}
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
                {/* Existing address fields */}
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

                {/* Province Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tỉnh/Thành phố:
                  </label>
                  <select
                    value={address.provinceId || "0"}
                    onChange={(e) => {
                      const selectedProvince = provinces.find(
                        (p) => p.id === e.target.value
                      );
                      handleAddressChange(index, "province", e.target.value, {
                        name: selectedProvince
                          ? selectedProvince.full_name
                          : "",
                      });
                    }}
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  >
                    <option value="0">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quận/Huyện:
                  </label>
                  <select
                    value={address.districtId || "0"}
                    onChange={(e) => {
                      const selectedDistrict = districts.find(
                        (d) => d.id === e.target.value
                      );
                      handleAddressChange(index, "district", e.target.value, {
                        name: selectedDistrict
                          ? selectedDistrict.full_name
                          : "",
                      });
                    }}
                    disabled={!address.provinceId}
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  >
                    <option value="0">Chọn Quận/Huyện</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ward Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phường/Xã:
                  </label>
                  <select
                    value={address.wardId || "0"}
                    onChange={(e) => {
                      const selectedWard = wards.find(
                        (w) => w.id === e.target.value
                      );
                      handleAddressChange(index, "ward", e.target.value, {
                        name: selectedWard ? selectedWard.full_name : "",
                      });
                    }}
                    disabled={!address.districtId}
                    className="mt-1 block w-full h-10 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4"
                  >
                    <option value="0">Chọn Phường/Xã</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Existing phone number and other fields */}
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
              {/* Existing delete button */}
              <button
                type="button"
                onClick={() => handleDeleteAddress(index)}
                className="mt-2 py-1 px-3 border border-red-600 text-red-600 rounded-md hover:bg-red-100"
              >
                Xóa
              </button>
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
