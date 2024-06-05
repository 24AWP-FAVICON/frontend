import React, { useState, useEffect } from "react";
import "./ChatList.css"; // 스타일 파일 import
import personIcon from "./person-icon.jpg"; // 이미지 파일 import
import { 
  updateChatRoomName, 
  createChatRoom, 
  getAllChatRooms, 
  deleteChatRoom, 
  getChatRoomById 
} from "./ChatApiService"; // API 서비스 가져오기

function ChatList({ setSelectedChat }) {
  const [showModal, setShowModal] = useState(false); // 모달 창 열고 닫는 상태
  const [newMessage, setNewMessage] = useState(""); // 새로운 대화를 위한 상태
  const [senderName, setSenderName] = useState(""); // 보내는 사람 이름을 위한 상태
  const [chats, setChats] = useState([]); // 채팅 목록 상태

  useEffect(() => {
    // 페이지 로드 시 채팅 목록을 가져오는 함수 호출
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await getAllChatRooms(); // 수정된 부분
      setChats(response);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSenderNameChange = (e) => {
    setSenderName(e.target.value);
  };

  const handleAddChat = async () => {
    if (newMessage.trim() !== "" && senderName.trim() !== "") {
      try {
        const newChatRoom = await createChatRoom(senderName, null, []); // 수정된 부분
        const newChat = {
          roomId: newChatRoom.id,
          sender: senderName,
          message: newMessage,
        };
        setChats([...chats, newChat]); // 채팅 목록 상태 업데이트
        setNewMessage("");
        setSenderName("");
        setShowModal(false);
      } catch (error) {
        console.error("Error creating chat room:", error);
      }
    }
  };

  const handleChatSelection = (chat) => {
    setSelectedChat({ sender: chat.sender, message: chat.message });
  };

  const handleDeleteChatRoom = async (roomId) => {
    try {
      await deleteChatRoom(roomId);
      fetchChatRooms();
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
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
            onClick={() => handleChatSelection(chat)}
          >
            <div className="chat-content">
              <img src={personIcon} alt="Person" className="person-icon" />
              <span className="chat-sender">{chat.sender}: </span>
              <span className="chat-message">{chat.message}</span>
              <button onClick={(e) => {
                e.stopPropagation();
                handleDeleteChatRoom(chat.roomId);
              }} className="delete-chat-button">삭제</button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="chat-modal">
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
