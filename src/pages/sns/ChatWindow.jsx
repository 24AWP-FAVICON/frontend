import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css"; // CSS 파일을 import합니다.

function ChatWindow({ selectedChat, onSendMessage }) {
  const [message, setMessage] = useState(""); // 입력된 채팅 메시지 상태
  const [chatHistory, setChatHistory] = useState([]); // 채팅 내역 상태
  const chatEndRef = useRef(null); // 채팅창의 맨 아래를 참조하기 위한 Ref

  // 대화 상대가 변경될 때마다 채팅 내역을 초기화합니다.
  useEffect(() => {
    setChatHistory([]);
  }, [selectedChat]);

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
          <div className="chat-body">
            {/* 채팅 내역을 매핑하여 출력 */}
            <ul>
              {chatHistory.map((chat, index) => (
                <li
                  key={index}
                  className={chat.sender === "나" ? "right" : "left"} // 적절한 클래스를 적용합니다.
                  style={{
                    backgroundColor: chat.sender === "나" ? "white" : "",
                  }} // 배경색을 조절합니다.
                >
                  {chat.sender === "나" ? "나: " : `${selectedChat.sender}: `}
                  {chat.message}
                </li>
              ))}
              <li ref={chatEndRef} /> {/* 채팅창의 맨 아래를 참조합니다. */}
            </ul>
          </div>
        </div>
      ) : (
        <div className="empty-chat">대화를 선택해주세요.</div>
      )}

      {/* 채팅 입력창 및 전송 버튼 */}
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
    </div>
  );
}

export default ChatWindow;
