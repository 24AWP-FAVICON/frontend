import React, { useState } from "react";
import "./Sns.css"; // 스타일 파일 import
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function Sns() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([
    { sender: "김가천", message: "안녕하세요!" },
    { sender: "박가천", message: "안녕하세요! 반가워요." },
    { sender: "팀1", message: "팀1입니다." },
  ]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = (newMessage) => {
    if (selectedChat) {
      // selectedChat이 null이 아닌지 확인
      if (newMessage.trim() !== "") {
        console.log("전송된 메시지:", newMessage);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.sender === selectedChat.sender
              ? { ...chat, message: newMessage }
              : chat
          )
        );
      }
    } else {
      console.log("전송할 채팅 대상을 선택하세요.");
    }
  };

  return (
    <div className="Sns">
      <ChatList chats={chats} setSelectedChat={handleSelectChat} />
      <ChatWindow
        selectedChat={selectedChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Sns;