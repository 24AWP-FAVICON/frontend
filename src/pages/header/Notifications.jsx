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
  
    // 마지막으로 받은 이벤트 ID를 로컬 스토리지에서 가져옴
    const lastEventId = localStorage.getItem('lastEventId') || '';
  
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
          'Last-Event-ID': lastEventId  // 마지막 이벤트 ID를 헤더에 추가
        },
        heartbeatTimeout: 1000 * 60 * 60,
        withCredentials: true,  // 자격 증명을 포함한 요청
        heartbeatTimeout: 86400000,  // 24시간 유지
      }
    );
  
    eventSource.onopen = () => {
      console.log("SSE connection established.");
    };
  
    let retryCount = 0;
  
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
  
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("SSE connection was closed.");
  
        const retryTimeout = Math.min(1000 * Math.pow(2, retryCount), 30000);  // 최대 30초
        retryCount++;
  
        setTimeout(() => {
          console.log("Reconnecting SSE...");
          connectSSE();  // 재연결 함수 호출
        }, retryTimeout);
      } else {
        console.log("SSE connection error, readyState:", eventSource.readyState);
      }
    };
  
    eventSource.onmessage = (event) => {
      try {
        const isJson = event.data.startsWith('{') && event.data.endsWith('}');
        let notification;
  
        if (isJson) {
          notification = JSON.parse(event.data);
        } else {
          notification = {
            lastEventId: Date.now(),  // 고유 ID 생성
            data: event.data  // 텍스트 데이터를 그대로 사용
          };
        }
  
        console.log("Parsed event data received:", notification);
  
        // 알림 상태 업데이트
        setNotifications((prevNotifications) => {
          const isDuplicate = prevNotifications.some((n) => n.lastEventId === notification.lastEventId);
          if (!isDuplicate) {
            // 새로운 알림을 상태에 추가
            localStorage.setItem('lastEventId', notification.lastEventId);  // 마지막 이벤트 ID 저장
            return [...prevNotifications, notification];
          }
          return prevNotifications;
        });
  
      } catch (error) {
        console.error("Failed to parse event data. Error:", error);
      }
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