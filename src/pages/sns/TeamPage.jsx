// TeamPage.jsx
import React from "react";
import ChatList from "./ChatList";

function TeamPage() {
  const teamChats = [
    { sender: "team1", message: "팀 대화입니다!" },
    { sender: "team2", message: "팀 대화 화이팅!" },
    { sender: "team3", message: "팀 대화 감사합니다!" },
  ];

  const handleSelectChat = (chat) => {
    // 팀 페이지에서 선택된 채팅 처리 로직
  };

  const goToPersonalPage = () => {
    // 개인 페이지로 이동하는 로직
    console.log("개인 페이지로 이동합니다.");
  };

  return (
    <div>
      <h2>팀 대화 페이지</h2>
      <ChatList
        chats={teamChats}
        onSelectChat={handleSelectChat}
        goToPersonalPage={goToPersonalPage}
      />
    </div>
  );
}

export default TeamPage;
