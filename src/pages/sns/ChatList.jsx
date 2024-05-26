import React, { useState } from "react";
import "./ChatList.css"; // 스타일 파일 import
import personIcon from "./person-icon.jpg"; // 이미지 파일 import

function ChatList({ chats, setSelectedChat }) {
  const [showModal, setShowModal] = useState(false); // 모달 창 열고 닫는 상태
  const [newMessage, setNewMessage] = useState(""); // 새로운 대화를 위한 상태
  const [senderName, setSenderName] = useState(""); // 보내는 사람 이름을 위한 상태

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSenderNameChange = (e) => {
    setSenderName(e.target.value);
  };

  const handleAddChat = () => {
    if (newMessage.trim() !== "" && senderName.trim() !== "") {
      // 새로운 대화를 추가하는 함수
      const newChat = {
        sender: senderName,
        message: newMessage,
      };
      // 채팅 목록에 추가
      chats.push(newChat);
      // 입력 필드 초기화
      setNewMessage("");
      setSenderName("");
      // 모달 창 닫기
      setShowModal(false);
    }
  };

  const handleChatSelection = (sender, message) => {
    setSelectedChat({ sender: sender, message: message }); // 선택된 대화 상대 설정
  };

  return (
    <div className="chat-list-container">
      <ul className="chat-list">
        <h2 className="chat-h2">메시지</h2>
        <button onClick={() => setShowModal(true)} className="add-chat-button">
          대화 추가
        </button>
        {chats.map((chat, index) => (
          <li
            key={index}
            className="chat-item"
            onClick={() => handleChatSelection(chat.sender, chat.message)} // 클릭 시 대화 상대 설정
          >
            <div className="chat-content">
              <img src={personIcon} alt="Person" className="person-icon" />
              <span className="chat-sender">{chat.sender}: </span>
              <span className="chat-message">{chat.message}</span>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>새로운 대화 추가</h2>
            <input
              type="text"
              value={senderName}
              onChange={handleSenderNameChange}
              placeholder="보내는 사람 이름"
              className="add-chat-input"
            />
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="링크 입력"
              className="add-chat-input"
            />
            <button onClick={handleAddChat} className="add-chat-modal-button">
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList;
