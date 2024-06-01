import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직 (예: 쿠키 삭제, 상태 초기화 등)
    Cookies.remove("access");
    Cookies.remove("refresh");
    setIsLoggedIn(false);
    window.location.href = "/login"; // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <header className="bg-white text-gray-600 body-font shadow w-full">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center w-full">
        <Link to="/" className="flex title-font font-medium items-center text-headerTextColor mb-4 md:mb-0">
          <span className="ml-3 text-3xl font-bold">Favicon</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center w-full md:w-auto">
          <Link to="/" className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150">Home</Link>
          <Link to="/community" className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150">Community</Link>
          <Link to="/sns" className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150">SNS</Link>
          {isLoggedIn ? (
            <>
              <Link to="/notifications" className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150">
                <FaBell size={24} />
              </Link>
              <div className="relative">
                <button onClick={toggleProfileMenu} className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150">
                  <FaUserCircle size={24} />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Log Out
                    </button>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
