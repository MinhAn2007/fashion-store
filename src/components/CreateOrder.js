import { Title, Button, Input, Select, Text } from "rizzui";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTag,
  FaShoppingCart,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { jwtDecode } from "jwt-decode"; // Nhớ cài đặt jwt-decode nếu chưa có
import { useAuthWithCheck } from "../hooks/useAuth";
const CreateOrder = () => {
  const location = useLocation();
  const { cartItems } = location.state || {
    cartItems: [],
    totalPrice: 0,
  };

  const [userInfo, setUserInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { checkApiResponse } = useAuthWithCheck();
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const API = process.env.REACT_APP_API_ENDPOINT;
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
    const totalAmount = (
        calculateTotal() +
        30000 - 
        (couponCode ? 50000 : 0)
      );
    const orderData = {
      userId: jwtDecode(token).userId, // Lấy userId từ token
      cartItems,
      selectedAddress: selectedAddress.label,
      paymentId: paymentMethod.value, // Hoặc cấu trúc dữ liệu phù hợp với backend của bạn
      couponId: couponCode, // Nếu bạn đang sử dụng mã giảm giá,
      total : totalAmount
    };

    try {
        console.log(orderData);
        
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
      // Có thể điều hướng hoặc hiển thị thông báo thành công tại đây
      console.log("Đơn hàng đã được tạo:", result);
      alert("Đơn hàng của bạn đã được tạo thành công!");
    } catch (error) {
      setErrorMessage(error.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
    }
  };
  // Calculate total based on cart items passed from the previous page
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.cartItemPrice, 0);
  };

  const paymentMethods = [
    { value: 1, label: "Thanh toán khi nhận hàng ( COD )" },
    { value: 2, label: "Thanh toán online ( Chuyển khoản )" },
  ];

  if (loading) return <Text>Đang tải...</Text>;

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
          {/* Cột trái - Form thông tin */}
          <div className="flex-1 space-y-6">
            {/* Thông tin khách hàng */}
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
                  defaultValue={addresses[0]}
                />
                <Link to="/account">
                  <Button variant="outline" className="w-full mt-4">
                    + Thêm địa chỉ mới
                  </Button>
                </Link>
              </div>
            </div>

            {/* Phương thức thanh toán */}
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
                onChange={(value) => setPaymentMethod(value)}
                placeholder="Chọn phương thức thanh toán"
                className="w-full h-10 bg-white"
              />
            </div>
            <div className="text-md text-gray-600 mt-4 text-center">
              Chúng tôi sẽ tiến hành gửi đơn đặt hàng của bạn trong thời gian
              ngắn nhất. Cảm ơn đã đi mua sắm với chúng tôi !
            </div>
          </div>

          {/* Cột phải - Thông tin đơn hàng */}
          <div className="w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              {/* Đơn hàng */}
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
                      <div className="flex items-center">
                        <div>
                          <Text className="font-medium">
                            {item.productName}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            SKU: {item.sku} x {item.quantity} ({item.size},{" "}
                            {item.color})
                          </Text>
                        </div>
                      </div>
                      <Text className="font-medium">
                        {item.cartItemPrice.toLocaleString()}đ
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mã giảm giá */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <FaTag className="w-5 h-5 mr-2" />
                  <Title as="h2" className="text-lg font-semibold">
                    Mã giảm giá
                  </Title>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                    inputClassName="pl-3"
                  />
                  <Button>Áp dụng</Button>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Text>Tổng tiền hàng</Text>
                  <Text className="font-medium">
                    {calculateTotal().toLocaleString()}đ
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
                <div className="flex justify-between items-center font-semibold">
                  <Text>Tổng cộng</Text>
                  <Text>
                    {(
                      calculateTotal() +
                      30000 -
                      (couponCode ? 50000 : 0)
                    ).toLocaleString()}
                    đ
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
