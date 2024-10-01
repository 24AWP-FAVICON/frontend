import React from 'react';
import { FaTimes } from 'react-icons/fa';

const NotificationList = ({ notifications, onClose, onDelete }) => {
  const getNotificationMessage = (notification) => {
    console.log("notification id " + notification.lastEventId);
    
    if (notification.data.includes("adds new like")) {
      return "👍 New like on your post!";
    }
    if (notification.data.includes("adds new comment")) {
      return "💬 New comment on your post!";
    }
    
    return notification.data;  // 기본적으로 받은 데이터를 출력
  };
  

  return (
    <div className="absolute top-12 right-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-slide-down">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">알림</h3>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <ul>
        {notifications.length === 0 ? (
          <li className="px-4 py-2 text-gray-600">알림이 없습니다.</li>
        ) : (
          notifications.map((notification) => (
            <li key={notification.lastEventId} className="flex justify-between items-center px-4 py-2 border-b">
              <span>{getNotificationMessage(notification)}</span>
              <button onClick={() => onDelete(notification.lastEventId)} className="text-red-500 hover:text-red-700">
                삭제
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationList;