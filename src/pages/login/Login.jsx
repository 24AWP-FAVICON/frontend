import React from "react";
import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Favicon</h1>
        <p className="text-em text-gray-600 mb-6 text-center">
          소셜로 간편하게 로그인하세요.
        </p>
        <div className="flex flex-col items-center">
          <a
            href="http://localhost:8080/oauth2/authorization/google?prompt=select_account"
            className="flex items-center justify-center w-full bg-white text-gray-600 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            Google로 계속하기
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-10 text-center">
          계속 진행함으로써, <a href="#" className="text-blue-500 hover:underline">이용 약관</a> 및 <a href="#" className="text-blue-500 hover:underline">개인정보 처리방침</a>에 동의합니다.
        </p>
      </div>
    </div>
  );
}

export default Login;