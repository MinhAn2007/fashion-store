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
import OrderConfirmationModal from "./OrderConfirmationModal";

const CreateOrder = () => {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [], totalPrice: 0 };

  console.log("Cart Items 123:", cartItems);

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { checkApiResponse } = useAuthWithCheck();
  const [totalAmount, setTotalAmount] = useState(0);
  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_ENDPOINT;
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const SHIPPING_FEE = 30000;
  const ONLINE_PAYMENT_DISCOUNT = 50000;
  const [isOpen, setIsOpen] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.skuPrice),
      0
    );
  };

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.skuPrice || 0),
      0
    );
    setSubtotal(calculatedSubtotal);
  }, [cartItems]);

  const updateTotal = () => {
    let total = subtotal + SHIPPING_FEE;

    // Áp dụng mã giảm giá
    if (appliedCoupon) {
      const discount =
        appliedCoupon.coupon_type === "percent"
          ? roundToNearestThousand(
              (subtotal * parseFloat(appliedCoupon.coupon_value)) / 100
            )
          : roundToNearestThousand(parseFloat(appliedCoupon.coupon_value));
      total -= discount;
    }

    // Áp dụng giảm giá cho thanh toán online
    if (paymentMethod?.value === 2) {
      total -= ONLINE_PAYMENT_DISCOUNT;
    }

    setTotalAmount(total > 0 ? total : 0); // Đảm bảo tổng >= 0
  };

  useEffect(() => {
    updateTotal();
  }, [subtotal, appliedCoupon, paymentMethod]);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = 30000;

    // Round coupon discount to nearest thousand
    const couponDiscount = calculateCouponDiscount();
    const roundedCouponDiscount = roundToNearestThousand(couponDiscount);

    const onlinePaymentDiscount = paymentMethod?.value === 2 ? 50000 : 0;

    return (
      subtotal + shippingFee - roundedCouponDiscount - onlinePaymentDiscount
    );
  };

  const handleCheckCoupon = async () => {
    if (!couponCode) {
      setCouponError("Vui lòng nhập mã giảm giá");
      setCouponSuccess("");
      setAppliedCoupon(null);
      return;
    }

    setIsCheckingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const response = await fetch(`${API}/api/voucher/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          totalAmount: subtotal,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon(data.voucher);
        setCouponSuccess("Áp dụng mã giảm giá thành công!");
        updateTotal(subtotal);
      } else {
        setCouponError(data.message || "Mã giảm giá không hợp lệ");
        setAppliedCoupon(null);
        updateTotal(subtotal);
      }
    } catch (error) {
      setCouponError("Đã có lỗi xảy ra khi kiểm tra mã giảm giá");
      setAppliedCoupon(null);
      updateTotal(subtotal);
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    updateTotal(subtotal);
  };
  const roundToNearestThousand = (value) => {
    return Math.round(value / 1000) * 1000;
  };

  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.coupon_type === "percent") {
      const discount =
        (subtotal * parseFloat(appliedCoupon.coupon_value)) / 100;
      return roundToNearestThousand(discount);
    }
    return roundToNearestThousand(parseFloat(appliedCoupon.coupon_value));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await fetch(`${API}/api/users/${userId}`, {
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
        setTotalAmount(calculateSubtotal() + 30000);
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

  const addNewAddress = () => {
    navigate("/edit-profile", {
      state: { from: "/order", cartItems: cartItems },
    });
  };

  const openModalConfirm = () => {
    if (!selectedAddress || !paymentMethod) {
      alert("Vui lòng chọn địa chỉ và phương thức thanh toán.");
      return;
    }
    setIsOpen(true);

  };

  const handleCreateOrder = async () => {
    const orderData = {
      userId: jwtDecode(token).userId,
      cartItems,
      selectedAddress: selectedAddress.label,
      paymentId: paymentMethod.value,
      couponId: appliedCoupon?.id || null,
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
        window.location.href = data.url;
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
      navigate("/order-list");
    } catch (error) {
      alert("Đã xảy ra lỗi khi tạo đơn hàng.");
      setErrorMessage(error.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: 1, label: "Thanh toán khi nhận hàng ( COD )" },
    { value: 2, label: "Thanh toán online ( Chuyển khoản )" },
  ];

  if (loading)
    return (
      <div className="flex justify-center mx-auto min-h-[700px]">
        <Loader
          size="md"
          width={200}
          height={200}
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
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => addNewAddress()}
                >
                  + Thêm địa chỉ mới
                </Button>
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                    inputClassName="pl-3"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCheckCoupon}
                    disabled={isCheckingCoupon}
                  >
                    {isCheckingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                  </Button>
                </div>
                {couponError && (
                  <Text className="text-red-500 text-sm mt-2">
                    {couponError}
                  </Text>
                )}
                {couponSuccess && (
                  <Text className="text-green-500 text-sm mt-2">
                    {couponSuccess}
                  </Text>
                )}
              </div>

              <div className="border-gray-300 pt-4 mb-6">
                <div className="flex justify-between">
                  <Text className="text-gray-700">Tạm tính</Text>
                  <Text className="font-semibold">
                    {formatPrice(calculateSubtotal())}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text>Phí vận chuyển</Text>
                  <Text className="font-medium">30,000đ</Text>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <Text>
                      Giảm giá (
                      {appliedCoupon.coupon_type === "percent"
                        ? `${appliedCoupon.coupon_value}%`
                        : formatPrice(appliedCoupon.coupon_value)}
                      )
                    </Text>
                    <Text className="font-medium">
                      -{formatPrice(calculateCouponDiscount())}
                    </Text>
                  </div>
                )}
                {paymentMethod?.value === 2 && (
                  <div className="flex justify-between items-center text-green-600">
                    <Text>Giảm giá thanh toán online</Text>
                    <Text className="font-medium">-50,000đ</Text>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold mt-4">
                  <Text>Tổng cộng</Text>
                  <Text className="text-lg font-bold text-red-600">
                    {formatPrice(calculateTotal())}
                  </Text>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-black text-white hover:bg-opacity-30"
                onClick={() => openModalConfirm()}
              >
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
      <OrderConfirmationModal
        isOpen={isOpen}
        orderDetails={{
          cartItems,
          selectedAddress: selectedAddress,
          paymentMethod: paymentMethod,
          totalAmount,
          appliedCoupon,
          subtotal: calculateSubtotal(),
          shippingFee: 30000,
        }}
        onClose={() => setIsOpen(false)}
        onConfirm={() => handleCreateOrder()}
      />
    </div>
  );
};

export default CreateOrder;
