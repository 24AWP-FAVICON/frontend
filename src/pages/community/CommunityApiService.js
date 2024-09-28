import api from '../../Frontend_API';

export const fetchPosts = () => {
  return api.get('/community/posts');
};

export const fetchPostById = (postId) => {
  return api.get(`/community/post/${postId}`);
};

export const createPost = (postData) => {
  return api.post('/community/posts', postData);
};

export const updatePost = (postId, postData) => { 
  return api.put(`/community/post/${postId}`, postData);
};

export const deletePost = (postId) => {
  return api.delete(`/community/post/${postId}`);
};

export const likePost = (postId) => {
  return api.get(`/community/post/${postId}/like`);
};

export const unlikePost = (postId) => {
  return api.delete(`/community/post/${postId}/like`);
};

export const fetchCommentsByPostId = (postId) => {
  return api.get(`/community/post/${postId}/comments`);
};

export const addComment = (postId, commentData) => {
  return api.post(`/community/post/${postId}/comment`, commentData);
};

export const updateComment = (postId, commentId, commentData) => {
  return api.put(`/community/post/${postId}/comment/${commentId}`, commentData);
};

export const deleteComment = (postId, commentId) => {
  return api.delete(`/community/post/${postId}/comment/${commentId}`);
};

export const fetchFollows = () => {
  return api.get('/community/following');
};

export const fetchFollowers = () => {
  return api.get('/community/follower');
};

export const followUser = (userId) => {
  return api.post(`/community/follow/${userId}`);
};

export const unfollowUser = () => {
  return api.delete('/community/follow');
};

export const blockUser = (userId, reason) => {
  return api.post(`/community/block/${userId}`, { blockReason: reason });
};

export const unblockUser = (userId) => {
  return api.delete(`/delete-block/${userId}`);
};

export const fetchBlocks = () => {
  return api.get('/community/blocks');
};

export const uploadPostImage = (postId, imageData) => {
  return api.post(`/community/post/${postId}/s3/upload`, imageData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 특정 사용자의 포스트 가져오기
export const fetchUserPosts = (userId) => {
  return api.get(`/community/posts/user/${userId}`);
};

// extractUrl 함수 추가
export const extractUrl = (markdown) => {
    const regex1 = /!\[.*?\]\((.*?)\)/;
    const regex2 = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/;
    const match1 = regex1.exec(markdown);
    const match2 = regex2.exec(markdown);
    return match1 ? match1[1] : (match2 ? match2[0] : '');
};