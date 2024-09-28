import React, { useEffect, useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { FaBell } from "react-icons/fa";
import NotificationList from "./NotificationList";
import { EventSourcePolyfill } from "event-source-polyfill";  // EventSource-Polyfill import

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const eventSourceRef = useRef(null);  // SSE 연결을 관리하기 위한 ref

  const connectSSE = useCallback(() => {
    const accessToken = Cookies.get("access");
  
    if (!accessToken) {
      console.error("Access token is missing.");
      return;
    }

    // 중복 연결 방지
    if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
      console.log("SSE already connected.");
      return;
    }

    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_API_BASE_URL}/users/alarm/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        heartbeatTimeout: 1000 * 60 * 60,
        withCredentials: true, // 클라이언트가 자격 증명을 포함한 요청을 보내도록 설정
      }
    );

    eventSource.onopen = () => {
      console.log("SSE connection established.");
    };

    let retryCount = 0;  // 재연결 시도 횟수 추적

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);

      // 연결이 닫힌 경우에만 재연결을 시도
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("SSE connection was closed.");

        // 지수 백오프 알고리즘 사용하여 재연결 지연 시간 증가
        const retryTimeout = Math.min(1000 * Math.pow(2, retryCount), 30000);  // 최대 30초
        retryCount++;

        setTimeout(() => {
          console.log("Reconnecting SSE...");
          connectSSE();  // 재연결 함수 호출
        }, retryTimeout);  // 백오프 시간 후 재연결 시도
      } else {
        console.log("SSE connection error, readyState:", eventSource.readyState);
      }
    };

    eventSource.onmessage = (event) => {
      console.log("Raw event data received:", event);  // 원시 이벤트 데이터를 로그로 확인
      setNotifications((prevNotifications) => [...prevNotifications, event]);
    };

    eventSourceRef.current = eventSource;
  }, []);

  useEffect(() => {
    connectSSE();  // 컴포넌트가 마운트될 때 SSE 연결

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();  // 컴포넌트가 언마운트될 때 SSE 연결 해제
        eventSourceRef.current = null;  // 연결 해제 후 참조 제거
      }
    };
  }, [connectSSE]); // connectSSE를 의존성 배열에 추가하여 ESLint 경고 제거

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

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
        setNotifications((prev) => prev.filter((notification) => notification.lastEventId !== id));
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button onClick={handleNotificationClick} className="relative">
        <FaBell />
        {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
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