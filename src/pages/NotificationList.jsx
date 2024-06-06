import React from 'react';
import { FaTimes } from 'react-icons/fa';

const NotificationList = ({ notifications, onClose, onDelete }) => {
  return (
    <div className="absolute top-12 right-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
            <li key={notification.id} className="flex justify-between items-center px-4 py-2 border-b">
              <span>{notification.text}</span>
              <button onClick={() => onDelete(notification.id)} className="text-red-500 hover:text-red-700">
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