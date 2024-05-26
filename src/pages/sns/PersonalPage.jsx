// PersonalPage.jsx
import React from "react";
import ChatList from "./ChatList";

function PersonalPage() {
  const personalChats = [
    { sender: "user1", message: "안녕하세요!" },
    { sender: "user2", message: "안녕하세요! 반가워요." },
    { sender: "user3", message: "안녕하세요! 오랜만이에요." },
  ];

  const handleSelectChat = (chat) => {
    // 개인 페이지에서 선택된 채팅 처리 로직
  };

  const goToTeamPage = () => {
    // 팀 페이지로 이동하는 로직
    console.log("팀 페이지로 이동합니다.");
  };

  return (
    <div>
      <h2>개인 대화 페이지</h2>
      <ChatList
        chats={personalChats}
        onSelectChat={handleSelectChat}
        goToTeamPage={goToTeamPage}
      />
    </div>
  );
}

export default PersonalPage;
