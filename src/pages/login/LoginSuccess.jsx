import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = Cookies.get("access");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) {
          // Access Token 만료: 로그아웃 로직 추가
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        Cookies.set("userEmail", data.userId, { path: '/' });
        navigate("/");
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default LoginSuccess;