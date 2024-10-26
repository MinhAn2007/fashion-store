import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate

export const useAuthWithCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        // Giải mã token
        try {
          const decoded = jwtDecode(token);
          setUserData(decoded); // Lưu dữ liệu từ token
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Hàm kiểm tra phản hồi từ API
  const checkApiResponse = (apiResponse) => {
    if (apiResponse && apiResponse.status === 401) {
      toast({
        title: "Phiên làm việc đã hết hạn",
        description: "Vui lòng đăng nhập lại.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Chuyển hướng về trang đăng nhập
      navigate("/login"); // Sử dụng navigate thay vì history.push
    }
  };

  return { isAuthenticated, userData, checkApiResponse }; // Đảm bảo rằng checkApiResponse được trả về
};
