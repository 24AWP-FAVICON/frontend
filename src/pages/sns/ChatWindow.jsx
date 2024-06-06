import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';
import { getChatRoomById, inviteUserToChatRoom, getChatRoomMessagesById } from './ChatApiService'; // API 서비스에서 함수 가져오기

const SOCKET_URL = 'http://localhost:8080/ws';

function ChatWindow({ selectedChat, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const chatBodyRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const userId = Cookies.get('userEmail');

  useEffect(() => {
    if (selectedChat && selectedChat.id) {
      if (!chatHistories[selectedChat.id]) {
        fetchChatHistory(selectedChat.id);
      }
    }

    const socket = new SockJS(SOCKET_URL, null, { transports: ['xhr-streaming'], withCredentials: true });
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      console.log('Connected to server');
      setStompClient(client);
      if (selectedChat && selectedChat.id) {
        client.subscribe(`/sub/channel/${selectedChat.id}`, (msg) => {
          const message = JSON.parse(msg.body);
          setChatHistories(prevHistories => ({
            ...prevHistories,
            [selectedChat.id]: [...(prevHistories[selectedChat.id] || []), message]
          }));
          scrollToBottom();
        });
      }
    }

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

  }, [selectedChat]);

  const fetchChatHistory = async (roomId) => {
    try {
      const messages = await getChatRoomMessagesById(roomId);
      setChatHistories(prevHistories => ({
        ...prevHistories,
        [roomId]: messages
      }));
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.trim() !== "" && stompClient && selectedChat) {
      const newChat = {
        user: {
          userId: userId
        },
        room: {
          roomId: selectedChat.id,
        }, 
        content: message.trim()        
      };
      stompClient.publish({
        destination: "/pub/message",
        body: JSON.stringify(newChat),
        headers: { Authorization: `Bearer ${Cookies.get('access')}` }
      });

      // onSendMessage(message); 이 부분을 제거하여 메시지를 즉시 목록에 추가하지 않음
      setMessage("");
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
            <span className="chat-room-name">{selectedChat.name}</span>
            <button onClick={() => setShowInviteModal(true)} className="invite-user-button">사용자 초대</button>
            <button onClick={() => setShowParticipantsModal(true)} className="view-participants-button">참여자 목록</button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            <ul>
              {(chatHistories[selectedChat.id] || []).map((chat, index) => (
                <li
                  key={index}
                  className={chat.senderId === userId ? "right" : "left"}
                >
                  {chat.senderId === userId ? "나: " : `${chat.senderId}: `}
                  {chat.content}
                </li>
              ))}
            </ul>
          </div>
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
      ) : (
        <div className="empty-chat">대화를 선택해주세요.</div>
      )}
      {showInviteModal && (
        <div className="chat-modal">
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
              className="add-chat-input"
            />
            <button onClick={handleInviteUser} className="add-chat-modal-button">초대</button>
          </div>
        </div>
      )}
      {showParticipantsModal && (
        <div className="chat-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowParticipantsModal(false)}>
              &times;
            </span>
            <h2>참여자 목록</h2>
            <ul>
              {selectedChat.users.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
