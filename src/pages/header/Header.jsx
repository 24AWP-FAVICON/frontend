import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import Notifications from "./Notifications";
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");
    const email = Cookies.get("userEmail");

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      if (email) {
        setUserEmail(email);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

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
        navigate("/login");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Failed to logout", error);
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
                <Notifications />
              </div>
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="hover:text-headerTextColor font-semibold hover:scale-105 transition duration-150"
                >
                  <FaUserCircle size={24} />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-5 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b">
                      <p className="text-lg font-semibold">개인 메뉴</p>{" "}
                    </div>
                    <div className="py-1">
                      <Link
                        to="/userprofile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Profile
                      </Link>
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