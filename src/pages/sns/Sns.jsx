import React, { useState } from "react";
import "./Sns.css"; // 스타일 파일 import
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function Sns() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState(""); // 입력된 메시지 상태 추가

  const chats = [
    { sender: "김가천", message: "안녕하세요!" },
    { sender: "박가천", message: "안녕하세요! 반가워요." },
    { sender: "팀1", message: "팀1입니다." },
  ];

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    // 메시지 전송 로직
    if (message.trim() !== "") {
      // 공백을 제외한 메시지만 전송
      console.log("전송된 메시지:", message);
      // 여기에 메시지 전송 로직을 추가하세요.
      // 예: API 호출 등
      setMessage(""); // 메시지 전송 후 입력된 메시지 초기화
    }
  };

  return (
    <div className="Sns">
      <ChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        setSelectedChat={setSelectedChat} // setSelectedChat 함수를 props로 전달
      />
      <ChatWindow
        selectedChat={selectedChat}
        message={message} // 입력된 메시지 전달
        onSendMessage={handleSendMessage}
        setSelectedChat={setSelectedChat} // setSelectedChat 함수 전달
        onMessageChange={(e) => setMessage(e.target.value)} // 메시지 변경 핸들러
      />
    </div>
  );
}

export default Sns;
