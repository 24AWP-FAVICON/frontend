import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { FcGoogle } from 'react-icons/fc'; // Google 아이콘 가져오기

function Login() {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID';

  const onSuccess = (response) => {
    console.log('Login Success: currentUser:', response.profileObj);
    alert(`Logged in successfully welcome ${response.profileObj.name}.`);
  };

  const onFailure = (response) => {
    console.log('Login failed: res:', response);
    alert('Failed to log in.');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Favicon</h1>
        <p className="text-em text-gray-600 mb-6 text-center">소셜로 간편하게 로그인하세요.</p>
        <div className="flex flex-col items-center">
          <GoogleLogin
            clientId={clientId}
            render={renderProps => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="bg-gray-300 hover:bg-gray-700 text-white font-bold py-4 px-20 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center"
              >
                <FcGoogle className="w-6 h-6 mr-3" />
                Google로 계속하기
              </button>
            )}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
          />
        </div>
        {/* <p className="text-sm text-gray-600 mt-6 text-center">
          계속 진행함으로써, <a href="#" className="text-blue-500 hover:underline">이용 약관</a> 및 <a href="#" className="text-blue-500 hover:underline">개인정보 처리방침</a>에 동의합니다.
        </p> */}
      </div>
    </div>
  );
}

export default Login;
