import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaBell } from "react-icons/fa";
import NotificationList from "./NotificationList";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("access");

    if (accessToken) {
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/alarm`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data); // 데이터 구조 확인
            setNotifications(data);
          } else {
            console.error("Failed to fetch notifications");
          }
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      }, 5000); // 5초마다 폴링

      return () => clearInterval(intervalId);
    }
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDeleteNotification = async (id) => {
    const accessToken = Cookies.get("access");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/alarm/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleNotificationClick}>
        <FaBell />
        {notifications.length > 0 && <span>{notifications.length}</span>}
      </button>
      {showNotifications && (
        <NotificationList
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onDelete={handleDeleteNotification}
        />
      )}
    </div>
  );
};

export default Notifications;
