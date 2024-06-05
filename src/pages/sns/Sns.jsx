import React, { useState } from "react";
import "./Sns.css"; // 스타일 파일 import
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function Sns() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([
    { roomId: 1, sender: "김가천", message: "안녕하세요!" },
    { roomId: 2, sender: "박가천", message: "안녕하세요! 반가워요." },
    { roomId: 3, sender: "팀1", message: "팀1입니다." },
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

  // 임의의 새로운 채팅방 추가
  const handleAddNewChat = () => {
    const newChat = {
      roomId: chats.length + 1, // 채팅방의 ID는 현재 채팅방의 수에 1을 더한 값으로 설정합니다.
      sender: "새로운 채팅방",
      message: "환영합니다!",
    };
    setChats((prevChats) => [...prevChats, newChat]); // 기존 채팅방 목록에 새로운 채팅방을 추가합니다.
  };

  return (
    <div className="Sns">
      <ChatList chats={chats} setSelectedChat={handleSelectChat} onAddNewChat={handleAddNewChat} />
      <ChatWindow
        selectedChat={selectedChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Sns;
