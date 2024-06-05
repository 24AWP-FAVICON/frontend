import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css"; // CSS 파일을 import합니다.

function ChatWindow({ selectedChat, onSendMessage }) {
  const [message, setMessage] = useState(""); // 입력된 채팅 메시지 상태
  const [chatHistory, setChatHistory] = useState([]); // 채팅 내역 상태
  const chatBodyRef = useRef(null); // 채팅창의 몸체를 참조하기 위한 Ref

  // 대화 상대가 변경될 때마다 채팅 내역을 초기화하고 새로운 대화 내역을 가져옵니다.
  useEffect(() => {
    if (selectedChat) {
      setChatHistory([]); // 선택된 채팅이 있을 때만 채팅 내역 초기화
      fetchChatHistory(selectedChat.id); // 대화 내역 가져오기
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // 가상의 서버와의 통신을 통해 대화 내역을 가져오는 함수
  const fetchChatHistory = (partnerId) => {
    // 가정: 서버와의 통신을 통해 대화 내역을 가져옴
    const response = simulateServerRequest(partnerId); // 가상의 서버 요청
    // 서버 응답에서 메시지 추출 및 설정
    if (response.success) {
      setChatHistory(response.messages);
      scrollToBottom(); // 채팅창 맨 아래로 스크롤
    } else {
      console.error("대화 내역을 가져오는 데 실패했습니다.");
    }
  };

  // 채팅창 맨 아래로 스크롤하는 함수
  const scrollToBottom = () => {
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  };

  // 채팅 메시지 입력 핸들러
  const handleMessageChange = (e) => {
    setMessage(e.target.value); // 입력된 채팅 메시지 업데이트
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim() !== "") {
      // 입력된 채팅 메시지가 비어있지 않은 경우에 실행
      const newChat = {
        sender: "나", // 대화 상대 이름
        message: message.trim(), // 입력된 메시지
      };
      // 이전 채팅 내역에 새로운 채팅을 배열의 끝에 추가
      setChatHistory([...chatHistory, newChat]);
      // 메시지 전송 콜백 호출
      onSendMessage(message);
      // 입력된 채팅 메시지 초기화
      setMessage("");
      scrollToBottom(); // 채팅창 맨 아래로 스크롤
    }
  };

  // 엔터 키 입력 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // 눌러진 키가 엔터 키인 경우
      sendMessage(); // 채팅 메시지 전송
    }
  };

  return (
    <div className="chat-window">
      {selectedChat ? (
        <div className="chat">
          <div className="chat-header">
            <span className="chat-sender">{selectedChat.sender}</span>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {/* 채팅 내역을 매핑하여 출력 */}
            <ul>
              {chatHistory.map((chat, index) => (
                <li
                  key={index}
                  className={chat.sender === "나" ? "right" : "left"} // 적절한 클래스를 적용합니다.
                >
                  {chat.sender === "나" ? "나: " : `${selectedChat.sender}: `}
                  {chat.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="empty-chat">대화를 선택해주세요.</div>
      )}

      {/* 채팅 입력창 및 전송 버튼 */}
      {selectedChat && (
        <div className="chat-input">
          <input
            type="text"
            placeholder="메시지 입력..."
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;

// 가상의 서버 요청 함수 (실제로는 서버와의 통신을 시뮬레이션하는 함수)
const simulateServerRequest = (partnerId) => {
  // 대화 상대의 ID를 기반으로 가상의 서버 요청을 보냄
  // 실제로는 서버에 HTTP 요청을 보내거나 WebSocket을 사용하여 서버와 실시간으로 통신함
  // 이 예시에서는 가상의 응답을 반환함
  return {
    success: true,
    messages: [
      { sender: "상대방", message: "안녕하세요!" },
      { sender: "상대방", message: "어떻게 지내세요?" },
    ],
  };
};