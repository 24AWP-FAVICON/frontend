import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        console.log(data);

        Cookies.set("userEmail", data.userId, { path: '/' });

        navigate("/");
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        navigate("/login");
      }
    };

    if (accessToken && refreshToken) {
      fetchUserInfo();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default LoginSuccess;