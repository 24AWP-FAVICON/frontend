import api from '../../Frontend_API';

// 채팅방 이름 업데이트
export const updateChatRoomName = (roomId, name, creatorUserId) => {
  return api.put(`/messenger/chatRoom/${roomId}/name`, { name, creatorUserId });
};

// 새 채팅방 생성
export const createChatRoom = (name, creatorUserId, participantIds) => {
  return api.post(`/messenger/chatRoom`, { name, creatorUserId, participantIds });
};

// 특정 채팅방 정보 가져오기
export const getChatRoomById = (roomId) => {
  return api.get(`/messenger/chatRoom/${roomId}`);
};

// 특정 채팅방에 사용자 초대
export const inviteUserToChatRoom = (roomId, inviteUserId) => {
  return api.post(`/messenger/chatRoom/${roomId}`, { inviteUserId });
};

// 특정 채팅방 삭제
export const deleteChatRoom = (roomId) => {
  return api.delete(`/messenger/chatRoom/${roomId}`);
};

// 모든 채팅방 목록 가져오기
export const getAllChatRooms = async () => {
    try {
        const response = await api.get(`/messenger/chatRooms`);
        // 서버 응답의 상태 코드 확인
        if (response.status === 200) {
            // 채팅방 목록이 정상적으로 반환된 경우
            return response.data;
        } else {
            // 채팅방 목록이 없는 경우 등의 오류 처리
            console.error("Failed to get chat rooms: ", response.statusText);
            // 여기서 적절한 처리를 수행합니다. 예를 들어 사용자에게 오류 메시지를 표시할 수 있습니다.
            // 또는 빈 배열을 반환하여 채팅방 목록이 없음을 나타낼 수도 있습니다.
            return [];
        }
    } catch (error) {
        console.error("Error getting chat rooms: ", error);
        // 에러 처리 - 예를 들어 오류 메시지를 사용자에게 표시하거나, 적절한 처리를 수행합니다.
        throw error; // 에러를 상위 컴포넌트로 전파할 수도 있습니다.
    }
};
// 특정 채팅방의 메시지를 읽음으로 표시
export const markMessagesAsRead = (roomId) => {
  return api.put(`/messages/read/${roomId}`);
};
