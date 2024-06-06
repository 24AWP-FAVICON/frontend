import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaBell, FaUserCircle } from "react-icons/fa";
import NotificationList from "./NotificationList";
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");
    const email = Cookies.get("userEmail");

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      fetchNotifications();
      if (email) {
        setUserEmail(email);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get("access");

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        Cookies.remove("access");
        Cookies.remove("refresh");
        Cookies.remove("userEmail");
        setIsLoggedIn(false);
        window.location.href = "/login";
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const fetchNotifications = async () => {
    const dummyNotifications = [
      { id: 1, message: "새로운 댓글이 달렸습니다." },
      { id: 2, message: "새로운 좋아요를 받았습니다." },
    ];
    setNotifications(dummyNotifications);
    if (dummyNotifications.length > 0) {
      setHasNotifications(true);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDeleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    if (updatedNotifications.length === 0) {
      setHasNotifications(false);
    }
  };

  return (
    <header className="bg-white text-gray-600 body-font shadow w-full">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center w-full">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-headerTextColor mb-4 md:mb-0"
        >
          <img src={`${process.env.PUBLIC_URL}/HeaderLogo.png`} className="logo-image" alt="Logo"/>
          <span className="ml-3 text-3xl font-bold logo-text">TOUS</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center w-full md:w-auto">
          <Link
            to="/"
            className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150"
          >
            Home
          </Link>
          <Link
            to="/community"
            className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150"
          >
            Community
          </Link>
          <Link
            to="/sns"
            className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150"
          >
            SNS
          </Link>
          {isLoggedIn ? (
            <>
              <div className="relative mr-10">
                <button
                  onClick={handleNotificationClick}
                  className="hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150 relative"
                >
                  <FaBell size={24} />
                  {hasNotifications && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationList
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onDelete={handleDeleteNotification}
                  />
                )}
              </div>
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150"
                >
                  <FaUserCircle size={24} />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-5 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-lg font-semibold">개인 메뉴</p>{" "}
                    </div>
                    <div className="py-1">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="mr-10 hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;