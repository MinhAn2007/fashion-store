import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    addresses: [{ addressLine: '', city: '', state: '', phoneNumber: '' }],
  });
  
  const navigate = useNavigate();

  const handleChange = (e, index, field) => {
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
      addresses: [...formValues.addresses, { addressLine: '', city: '', state: '', phoneNumber: '' }],
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register form data: ', formValues);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>
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
        </form>
      </div>
    </div>
  );
};

export default Register;
