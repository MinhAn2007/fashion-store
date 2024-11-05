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
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    addresses: [{}],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API = process.env.REACT_APP_API_ENDPOINT;

  const validPhonePrefixes = [
    '032', '033', '034', '035', '036', '037', '038', '039',
    '096', '097', '098', '086', '083', '084', '085', '081',
    '082', '088', '091', '094', '070', '079', '077', '076',
    '078', '090', '093', '089', '056', '058', '092', '059', '099'
  ];

  const validatePhoneNumber = (phoneNumber, index) => {
    if (!Array.isArray(formErrors.addresses)) {
      setFormErrors(prev => ({
        ...prev,
        addresses: formValues.addresses.map(() => ({})),
      }));
    }

    const newErrors = [...(formErrors.addresses || [])];
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (!/^\d+$/.test(phoneNumber)) {
      newErrors[index] = {
        ...newErrors[index],
        phoneNumber: 'Số điện thoại chỉ chứa ký tự số',
      };
      setFormErrors({ ...formErrors, addresses: newErrors });
      return 'Số điện thoại chỉ chứa ký tự số';
    }

    if (cleanPhone.length !== 10) {
      newErrors[index] = {
        ...newErrors[index],
        phoneNumber: 'Số điện thoại phải có đúng 10 chữ số',
      };
      setFormErrors({ ...formErrors, addresses: newErrors });
      return 'Số điện thoại phải có đúng 10 chữ số';
    }

    const prefix = cleanPhone.substring(0, 3);
    if (!validPhonePrefixes.includes(prefix)) {
      newErrors[index] = {
        ...newErrors[index],
        phoneNumber: 'Đầu số không hợp lệ',
      };
      setFormErrors({ ...formErrors, addresses: newErrors });
      return 'Đầu số không hợp lệ';
    }

    newErrors[index] = {
      ...newErrors[index],
      phoneNumber: '',
    };
    setFormErrors({ ...formErrors, addresses: newErrors });
    return '';
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'firstName' || name === 'lastName') {
      if (!/^[\p{L}\s'-]+$/u.test(value)) {
        error = 'Trường này chỉ chứa các chữ cái, khoảng trắng, dấu gạch ngang và dấu nháy đơn';
      } else if (value.length < 2 || value.length > 50) {
        error = 'Trường này phải có từ 2 đến 50 ký tự';
      }
    } else if (name === 'email') {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = 'Email không đúng định dạng';
      }
    } else if (name === 'password') {
      if (value.length < 8) {
        error = 'Mật khẩu phải có ít nhất 8 ký tự';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
        error = 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt';
      }
    } else if (name === 'addressLine') {
      if (value.length < 5 || value.length > 100) {
        error = 'Địa chỉ phải có từ 5 đến 100 ký tự';
      }
    } else if (name === 'city' || name === 'state') {
      if (!/^[\p{L}\s'-]+$/u.test(value)) {
        error = 'Trường này chỉ chứa các chữ cái, khoảng trắng, dấu gạch ngang và dấu nháy đơn';
      } else if (value.length > 50) {
        error = 'Trường này phải có không quá 50 ký tự';
      }
    }
    return error;
  };

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      if (!Array.isArray(formErrors.addresses)) {
        setFormErrors(prev => ({
          ...prev,
          addresses: formValues.addresses.map(() => ({})),
        }));
      }

      const newAddresses = formValues.addresses.map((address, i) => {
        if (i === index) {
          const error = field === 'phoneNumber' ? validatePhoneNumber(value, index) : validateField(field, value);
          setFormErrors(prev => {
            const newErrors = [...(prev.addresses || [])];
            while (newErrors.length <= index) {
              newErrors.push({});
            }
            newErrors[index] = { ...newErrors[index], [field]: error };
            return { ...prev, addresses: newErrors };
          });
          return { ...address, [field]: value };
        }
        return address;
      });
      setFormValues({ ...formValues, addresses: newAddresses });
    } else {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const addAddress = () => {
    setFormValues({
      ...formValues,
      addresses: [...formValues.addresses, { addressLine: '', city: '', state: '', phoneNumber: '', type: '' }],
    });
    setFormErrors(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), {}],
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!Array.isArray(formErrors.addresses)) {
      setFormErrors(prev => ({
        ...prev,
        addresses: formValues.addresses.map(() => ({})),
      }));
    }

    const errors = {};
    ['firstName', 'lastName', 'email', 'password'].forEach(field => {
      const error = validateField(field, formValues[field]);
      if (error) errors[field] = error;
    });

    formValues.addresses.forEach((address, index) => {
      ['addressLine', 'city', 'state', 'phoneNumber'].forEach(field => {
        const error = field === 'phoneNumber'
          ? validatePhoneNumber(address[field], index)
          : validateField(field, address[field]);
        if (error) {
          if (!errors.addresses) errors.addresses = [];
          while (errors.addresses.length <= index) {
            errors.addresses.push({});
          }
          errors.addresses[index] = { ...errors.addresses[index], [field]: error };
        }
      });
    });

    setFormErrors(errors);

    if (Object.keys(errors).some(key => errors[key] || (Array.isArray(errors.addresses) && errors.addresses.some(err => Object.keys(err).length > 0)))) {
      setErrorMessage('Vui lòng kiểm tra lại các thông tin đã nhập');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
      }

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
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
        <Link to="/" className="text-black flex">
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
                  onChange={handleChange}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                )}
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
                  onChange={handleChange}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                )}
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
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
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
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                )}
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
                      <option value="">Chọn loại địa chỉ</option>
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
                    {formErrors.addresses?.[index]?.addressLine && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.addresses[index].addressLine}</p>
                    )}
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
                    {formErrors.addresses?.[index]?.city && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.addresses[index].city}</p>
                    )}
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
                    {formErrors.addresses?.[index]?.state && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.addresses[index].state}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`phoneNumber-${index}`} className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      id={`phoneNumber-${index}`}
                      type="tel"
                      required
                      className={`mt-1 block w-full h-10 shadow-sm sm:text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black ${formErrors.addresses?.[index]?.phoneNumber ? 'border-red-500' : ''
                        }`}
                      value={address.phoneNumber}
                      onChange={(e) => handleChange(e, index, 'phoneNumber')}
                      placeholder="VD: 0321234567"
                    />
                    {formErrors.addresses?.[index]?.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.addresses[index].phoneNumber}</p>
                    )}
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
