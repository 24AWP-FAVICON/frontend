import React, { useState, useEffect } from "react";
import "./ChatList.css"; // 스타일 파일 import
import personIcon from "./person-icon.jpg"; // 이미지 파일 import
import { 
  getAllChatRooms, 
  createChatRoom, 
  deleteChatRoom 
} from "./ChatApiService"; // API 서비스 가져오기

function ChatList({ setSelectedChat }) {
  const [showModal, setShowModal] = useState(false); // 모달 창 열고 닫는 상태
  const [chatRoomName, setChatRoomName] = useState(""); // 채팅방 이름 상태
  const [participantEmail, setParticipantEmail] = useState(""); // 참여자 이메일 상태
  const [chats, setChats] = useState([]); // 채팅 목록 상태

  useEffect(() => {
    // 페이지 로드 시 채팅 목록을 가져오는 함수 호출
    if (chats.length === 0) {
      fetchChatRooms();
    }
  }, []); // 빈 배열을 전달하여 첫 로드 시에만 호출되도록 함

  const fetchChatRooms = async () => {
    try {
      const response = await getAllChatRooms(); // 수정된 부분
      setChats(response);
      console.log("모든 채팅방 조회: ", response);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const handleRoomNameChange = (e) => {
    setChatRoomName(e.target.value);
  };

  const handleParticipantEmailChange = (e) => {
    setParticipantEmail(e.target.value);
  };

  const handleAddChat = async () => {
    if (chatRoomName.trim() !== "" && participantEmail.trim() !== "") {
      try {
        const newChatRoom = await createChatRoom(chatRoomName, [participantEmail]); // 수정된 부분
        console.log(newChatRoom, "생성할 채팅방");
        setChats([...chats, newChatRoom]); // 채팅 목록 상태 업데이트
        setChatRoomName("");
        setParticipantEmail("");
        setShowModal(false);
      } catch (error) {
        console.error("Error creating chat room:", error);
      }
    }
  };

  const handleChatSelection = (chat) => {
    setSelectedChat({ sender: chat.users[0], id: chat.roomId });
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
              <span className="chat-sender">{chat.name}: </span>
              <span className="chat-message">{chat.users.join(", ")}</span>
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
              value={chatRoomName}
              onChange={handleRoomNameChange}
              placeholder="채팅방 이름"
              className="add-chat-input"
            />
            <input
              type="text"
              value={participantEmail}
              onChange={handleParticipantEmailChange}
              placeholder="참여자 이메일"
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
