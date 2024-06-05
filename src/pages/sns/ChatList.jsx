import React, { useState, useEffect } from "react";
import "./ChatList.css"; // 스타일 파일 import
import personIcon from "./person-icon.jpg"; // 이미지 파일 import
import { updateChatRoomName, createChatRoom, getAllChatRooms, deleteChatRoom, getChatRoomById } from "./ChatApiService";
import axios from "axios";


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
      const response = await axios.get("http://localhost:8080/chatRooms"); // 백엔드의 URL로 수정
      setChats(response.data);
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
        // 새로운 대화를 추가하는 함수
        const newChatRoom = await createChatRoom(senderName); // 새로운 채팅방 생성
        // 생성된 채팅방을 채팅 목록에 추가합니다.
        const newChat = {
          roomId: newChatRoom.id,
          sender: senderName,
          message: newMessage,
        };
        setChats([...chats, newChat]); // 채팅 목록 상태 업데이트
        // 입력 필드 초기화
        setNewMessage("");
        setSenderName("");
        // 모달 창 닫기
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
      // 채팅방 삭제 함수 호출
      await deleteChatRoom(roomId);
      // 삭제 후 채팅 목록 다시 불러오기
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
