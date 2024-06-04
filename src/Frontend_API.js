import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 환경 변수 사용
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("access");

    // 액세스 토큰이 없다면 로그인 페이지로 리디렉션
    if (!accessToken) {
      window.location.href = "/login";
    }

    // 토큰을 요청 헤더에 추가
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰이 만료되어 401 에러가 발생한 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // 새로운 액세스 토큰을 요청 헤더에 추가하고 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  const refreshToken = Cookies.get("refresh");

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, { token: refreshToken });
    const { accessToken } = response.data;

    // 새로운 액세스 토큰을 쿠키에 저장
    Cookies.set("access", accessToken, { path: '/' });
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    // 리프레시 토큰도 만료되었으면 로그인 페이지로 리디렉션
    window.location.href = "/login";
  }
}

export default api;