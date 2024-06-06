import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaBell, FaTimes } from "react-icons/fa";
import NotificationList from "./NotificationList";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    const accessToken = Cookies.get("access");

    if (accessToken) {
      const evtSource = new EventSource(
        `${process.env.REACT_APP_API_BASE_URL}/users/alarm/subscribe`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      evtSource.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        setNotifications((prev) => [...prev, newNotification]);
      };

      evtSource.onerror = () => {
        console.error("EventSource failed.");
        evtSource.close();
      };

      setEventSource(evtSource);

      return () => {
        if (evtSource) {
          evtSource.close();
        }
      };
    }
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDeleteNotification = async (id) => {
    const accessToken = Cookies.get("access");
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/alarm/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <div>
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