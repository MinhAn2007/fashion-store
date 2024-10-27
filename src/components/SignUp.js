import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';

const Register = () => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    addresses: [{ addressLine: '', city: '', state: '', phoneNumber: '', type: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API = process.env.REACT_APP_API_ENDPOINT;

  const handleChange = (e, index, field) => {
    console.log(e.target.value);
    console.log(index);
    
    
    if (index !== undefined) {
      const newAddresses = formValues.addresses.map((address, i) =>
        i === index ? { ...address, [field]: e.target.value } : address
      );
      setFormValues({ ...formValues, addresses: newAddresses });
    } else {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }
  };

  const addAddress = () => {
    setFormValues({
      ...formValues,
      addresses: [...formValues.addresses, { addressLine: '', city: '', state: '', phoneNumber: '', type: '' }],
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
          addresses: formValues.addresses,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
      }
      const data = await response.json();
      localStorage.setItem('token', data.loginResponse.token);
      setSuccessMessage("Bạn đã đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Error during registration:', error.message);
      setErrorMessage(error.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl">
        <Link to="/" className=" text-black flex">
          <IoMdArrowBack className="my-auto mr-2" /> Quay về trang chủ
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            <p className="ml-4 text-gray-700">Đang xử lý đăng ký...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Họ</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  value={formValues.firstName}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  value={formValues.lastName}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  value={formValues.email}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                  value={formValues.password}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            
            {formValues.addresses.map((address, index) => (
              <div key={index} className="space-y-4">
                <div className="text-lg font-medium text-gray-700">Địa chỉ {index + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label htmlFor={`type-${index}`} className="block text-sm font-medium text-gray-700">Loại địa chỉ</label>
                    <select
                      id={`type-${index}`}
                      required
                      className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                      value={address.type}
                      onChange={(e) => handleChange(e, index, 'type')}
                    >
                      <option value="Nhà riêng">Nhà riêng</option>
                      <option value="Công ty">Công ty</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`addressLine-${index}`} className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      id={`addressLine-${index}`}
                      type="text"
                      required
                      className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                      value={address.addressLine}
                      onChange={(e) => handleChange(e, index, 'addressLine')}
                    />
                  </div>
                  <div>
                    <label htmlFor={`city-${index}`} className="block text-sm font-medium text-gray-700">Thành phố</label>
                    <input
                      id={`city-${index}`}
                      type="text"
                      required
                      className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                      value={address.city}
                      onChange={(e) => handleChange(e, index, 'city')}
                    />
                  </div>
                  <div>
                    <label htmlFor={`state-${index}`} className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                    <input
                      id={`state-${index}`}
                      type="text"
                      required
                      className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                      value={address.state}
                      onChange={(e) => handleChange(e, index, 'state')}
                    />
                  </div>
                  <div>
                    <label htmlFor={`phoneNumber-${index}`} className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      id={`phoneNumber-${index}`}
                      type="text"
                      required
                      className="mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                      value={address.phoneNumber}
                      onChange={(e) => handleChange(e, index, 'phoneNumber')}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="mt-4 w-full bg-white text-black py-2 px-4 border border-black rounded-md hover:bg-gray-100"
              onClick={addAddress}
            >
              Thêm địa chỉ khác
            </button>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Đăng ký
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded-md text-center">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mt-4 p-4 border border-green-500 bg-green-100 text-green-700 rounded-md text-center">
                {successMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
