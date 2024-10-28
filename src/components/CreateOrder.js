import { Title, Button, Input, Select, Text, Loader } from "rizzui";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTag,
  FaShoppingCart,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { jwtDecode } from "jwt-decode"; // Install jwt-decode if not installed
import { useAuthWithCheck } from "../hooks/useAuth";
import { formatPrice } from "../utils/utils.js"; // Import formatPrice from utils
import { FaShippingFast, FaLock } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";

const CreateOrder = () => {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [], totalPrice: 0 };
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { checkApiResponse } = useAuthWithCheck();
  const [totalAmount, setTotalAmount] = useState(0);
  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_ENDPOINT;
  const [baseTotal, setBaseTotal] = useState(0);
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
          throw new Error(
            "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại."
          );
        }

        const data = await response.json();
        setUserInfo(data.user);
        setAddresses(data.addresses);
        const subtotal = calculateTotal();
        setBaseTotal(subtotal + 30000);
        setTotalAmount(subtotal + 30000);
      } catch (error) {
        setErrorMessage(
          error.message || "Đã xảy ra lỗi khi tải thông tin cá nhân."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleCreateOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      alert("Vui lòng chọn địa chỉ và phương thức thanh toán.");
      return;
    }

    const orderData = {
      userId: jwtDecode(token).userId,
      cartItems,
      selectedAddress: selectedAddress.label,
      paymentId: paymentMethod.value,
      couponId: couponCode,
      total: totalAmount,
    };

    setLoading(true);

    if (orderData.paymentId === 2) {
      try {
        localStorage.setItem("orderData", JSON.stringify(orderData));

        const response = await fetch(`${API}/api/create-payment-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount * 100,
            language: "vn",
            userName: userInfo.firstName + " " + userInfo.lastName,
          }),
        });

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tạo URL thanh toán");
        }

        const data = await response.json();
        console.log("Payment URL:", data.url);
        window.open(data.url, "_blank");
        return;
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }

    try {
      const response = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
      }

      const result = await response.json();
      console.log("Đơn hàng đã được tạo:", result);
      alert("Đơn hàng của bạn đã được tạo thành công!");
      navigate("/");
    } catch (error) {
      alert("Đã xảy ra lỗi khi tạo đơn hàng.");
      setErrorMessage(error.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.skuPrice),
      0
    );
  };

  const paymentMethods = [
    { value: 1, label: "Thanh toán khi nhận hàng ( COD )" },
    { value: 2, label: "Thanh toán online ( Chuyển khoản )" },
  ];

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);    
    if (value.value === 2) {
      setTotalAmount(baseTotal - 50000);
    } else {
      setTotalAmount(baseTotal);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mx-auto">
        <Loader
          size="lg"
          width={300}
          height={300}
          className="text-center my-40"
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 items-center justify-center">
        <Link to="/" className="text-black flex mt-10">
          <IoMdArrowBack className="my-auto mr-2" /> Quay về trang chủ
        </Link>
        <Title as="h1" className="text-2xl font-bold mb-6 text-center">
          Tạo đơn hàng
        </Title>

        <div className="flex gap-6">
          {/* Left Column - Form */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaUser className="w-5 h-5 mr-2" />
                <Title as="h2" className="text-lg font-semibold">
                  Thông tin khách hàng
                </Title>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Họ và tên</Text>
                  <Text className="font-medium">
                    {userInfo.firstName} {userInfo.lastName}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-600 mb-1">Email</Text>
                  <Text className="font-medium">{userInfo.email}</Text>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                <Title as="h2" className="text-lg font-semibold">
                  Địa chỉ giao hàng
                </Title>
              </div>
              <div className="space-y-4">
                <Select
                  options={addresses.map((addr, index) => ({
                    value: index,
                    label: `${addr.type}: ${addr.addressLine}, ${addr.city}, ${addr.state}, ${addr.country}`,
                  }))}
                  value={selectedAddress}
                  onChange={(value) => setSelectedAddress(value)}
                  placeholder="Chọn địa chỉ giao hàng"
                  dropdownClassName="bg-white w-auto p-2"
                  optionClassName="py-2 hover:bg-gray-300 items-center my-auto"
                />
                <Link to="/account">
                  <Button variant="outline" className="w-full mt-4">
                    + Thêm địa chỉ mới
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaCreditCard className="w-5 h-5 mr-2" />
                <Title as="h2" className="text-lg font-semibold">
                  Phương thức thanh toán
                </Title>
              </div>
              <Select
                options={paymentMethods}
                defaultValue={paymentMethods[0].value}
                value={paymentMethod}
                dropdownClassName="bg-white w-auto p-2"
                optionClassName="py-2 hover:bg-gray-300 items-center my-auto"
                onChange={handlePaymentMethodChange}
                placeholder="Chọn phương thức thanh toán"
                className="w-full h-10 bg-white"
              />
            </div>
            <div className="text-md text-gray-600 mt-4 text-center">
              <p className="text-sm text-gray-500 mb-6">
                (*) Thanh toán online sẽ được giảm giá 50,000đ cho đơn hàng của
                bạn.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-around w-full mt-12 space-y-6 md:space-y-0">
                <div className="flex flex-col items-center text-center p-4">
                  <FaShippingFast className="text-6xl text-gray-500 mb-2" />
                  <p className="text-lg font-medium text-gray-700">
                    Giao Hàng Nhanh
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <FaLock className="text-6xl text-gray-500 mb-2" />
                  <p className="text-lg font-medium text-gray-700">
                    Thanh Toán An Toàn
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <BsCurrencyDollar className="text-6xl text-gray-500 mb-2" />
                  <p className="text-lg font-medium text-gray-700">
                    Điểm Thưởng
                  </p>
                </div>
              </div>
              Chúng tôi sẽ tiến hành gửi đơn đặt hàng của bạn trong thời gian
              ngắn nhất. Cảm ơn đã đi mua sắm với chúng tôi!
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaShoppingCart className="w-5 h-5 mr-2" />
                  <Title as="h2" className="text-lg font-semibold">
                    Đơn hàng của bạn
                  </Title>
                </div>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex items-center">
                        <div>
                          <Text className="font-medium">
                            {item.productName}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Số lượng: {item.quantity} ({item.size}, {item.color}
                            )
                          </Text>
                        </div>
                      </div>
                      <Text className="font-medium">
                        {formatPrice(item.skuPrice)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mã giảm giá */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <FaTag className="w-5 h-5 mr-2" />
                  <Title as="h2" className="text-lg font-semibold">
                    Mã giảm giá
                  </Title>
                </div>
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                  inputClassName="pl-3"
                />
              </div>

              <div className=" border-gray-300 pt-4 mb-6">
                <div className="flex justify-between">
                  <Text className="text-gray-700">Subtotal</Text>
                  <Text className="font-semibold">
                    {formatPrice(calculateTotal())}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text>Phí vận chuyển</Text>
                  <Text className="font-medium">30,000đ</Text>
                </div>
                {couponCode && (
                  <div className="flex justify-between items-center text-green-600">
                    <Text>Giảm giá</Text>
                    <Text className="font-medium">-50,000đ</Text>
                  </div>
                )}
                {paymentMethod.value === 2 && (
                  <div className="flex justify-between items-center text-green-600">
                    <Text>Giảm giá thanh toán online</Text>
                    <Text className="font-medium">-50,000đ</Text>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold">
                  <Text>Tổng cộng</Text>
                  <Text className="text-lg font-bold text-red-600">
                    {formatPrice(totalAmount)}
                  </Text>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-black text-white hover:bg-opacity-30"
                onClick={() => handleCreateOrder()}
              >
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
