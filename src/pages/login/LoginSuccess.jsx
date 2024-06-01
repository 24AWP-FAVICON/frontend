import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // 쿠키에서 토큰 읽기
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    console.log("Access Token from Cookie:", accessToken);
    console.log("Refresh Token from Cookie:", refreshToken);

    if (accessToken && refreshToken) {
      navigate("/");
    } else {
      // 토큰이 없으면 로그인 페이지로 리디렉션
      navigate("/login");
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default LoginSuccess;