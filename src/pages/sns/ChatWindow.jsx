import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css"; // CSS 파일을 import합니다.
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';
import { getChatRoomById, inviteUserToChatRoom } from './ChatApiService'; // API 서비스에서 함수 가져오기

const SOCKET_URL = 'http://localhost:8080/ws'; // WebSocket 엔드포인트 URL

function ChatWindow({ selectedChat, onSendMessage }) {
  const [message, setMessage] = useState(""); // 입력된 채팅 메시지 상태
  const [chatHistories, setChatHistories] = useState(() => {
    const savedHistories = localStorage.getItem('chatHistories');
    return savedHistories ? JSON.parse(savedHistories) : {};
  }); // 여러 채팅방의 채팅 내역을 저장
  const chatBodyRef = useRef(null); // 채팅창의 몸체를 참조하기 위한 Ref
  const [stompClient, setStompClient] = useState(null);
  const [inviteEmail, setInviteEmail] = useState(""); // 초대할 사용자 이메일 상태
  const [showInviteModal, setShowInviteModal] = useState(false); // 초대 모달 상태

  const userId = Cookies.get('userId'); // 쿠키에서 사용자 ID를 가져옴

  useEffect(() => {
    if (selectedChat && selectedChat.id) {
      // 선택된 채팅이 있는 경우
      if (!chatHistories[selectedChat.id]) {
        // 이전에 이 채팅방의 내역이 없는 경우에만 서버에서 대화 내역을 가져옴
        fetchChatHistory(selectedChat.id);
      }
    }

    // WebSocket 연결 설정
    const socket = new SockJS(SOCKET_URL, null, { transports: ['xhr-streaming'], withCredentials: true });
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      if (selectedChat) {
        client.subscribe(`/sub/channel/${selectedChat.id}`, (msg) => {
          const message = JSON.parse(msg.body);
          setChatHistories(prevHistories => ({
            ...prevHistories,
            [selectedChat.id]: [...(prevHistories[selectedChat.id] || []), message]
          }));
          scrollToBottom();
        });
      }
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();

    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]); // selectedChat을 dependency로 추가하여 selectedChat이 변경될 때마다 실행

  useEffect(() => {
    // 채팅 내역이 변경될 때마다 로컬 스토리지에 저장
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }, [chatHistories]);

  const fetchChatHistory = async (partnerId) => {
    try {
      const response = await getChatRoomById(partnerId);
      if (response.data) {
        setChatHistories(prevHistories => ({
          ...prevHistories,
          [partnerId]: response.messages
        }));
        scrollToBottom();
      } else {
        console.error("대화 내역을 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const scrollToBottom = () => {
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // 입력된 채팅 메시지 업데이트
  };

  const sendMessage = () => {
    if (message.trim() !== "" && stompClient && selectedChat) {
      const newChat = {
        sender: userId, // 사용자 ID를 sender로 설정
        message: message.trim(), // 입력된 메시지
        roomId: selectedChat.id, // 채팅방 id
      };
      stompClient.publish({
        destination: "/pub/message",
        body: JSON.stringify(newChat),
        headers: { Authorization: `Bearer ${Cookies.get('access')}` } // 토큰 전달
      });

      setChatHistories(prevHistories => ({
        ...prevHistories,
        [selectedChat.id]: [...(prevHistories[selectedChat.id] || []), newChat]
      }));
      onSendMessage(message);
      setMessage("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleInviteEmailChange = (e) => {
    setInviteEmail(e.target.value);
  };

  const handleInviteUser = async () => {
    if (inviteEmail.trim() !== "" && selectedChat.id) {
      try {
        await inviteUserToChatRoom(selectedChat.id, inviteEmail);
        setInviteEmail("");
        setShowInviteModal(false);
      } catch (error) {
        console.error("Error inviting user to chat room:", error);
      }
    }
  };

  return (
    <div className="chat-window">
      {selectedChat ? (
        <div className="chat">
          <div className="chat-header">
            <span className="chat-sender">{selectedChat.sender}</span>
            <button onClick={() => setShowInviteModal(true)} className="invite-user-button">
              사용자 초대
            </button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            <ul>
              {(chatHistories[selectedChat.id] || []).map((chat, index) => (
                <li
                  key={index}
                  className={chat.sender === userId ? "right" : "left"}
                >
                  {chat.sender === userId ? "나: " : `${selectedChat.sender}: `}
                  {chat.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="empty-chat">대화를 선택해주세요.</div>
      )}
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
      {showInviteModal && (
        <div className="invite-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowInviteModal(false)}>
              &times;
            </span>
            <h2>사용자 초대</h2>
            <input
              type="text"
              value={inviteEmail}
              onChange={handleInviteEmailChange}
              placeholder="참여자 이메일"
              className="invite-chat-input"
            />
            <button onClick={handleInviteUser} className="invite-chat-modal-button">
              초대
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
