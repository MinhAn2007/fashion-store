import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

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

  return { isAuthenticated, userData };
};
