import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaRegComment, FaRegThumbsUp, FaShareSquare, FaTimes, FaHeart } from "react-icons/fa";
import Modal from "react-modal";
import './Community.css';
import {
  fetchPosts,
  fetchPostById,
  createPost,
  likePost,
  unlikePost,
  fetchCommentsByPostId,
  addComment,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  fetchFollows,
  fetchFollowers,
  fetchBlocks,
  uploadPostImage
} from './CommunityApiService'; // API 서비스 가져오기

Modal.setAppElement('#root');

function Community() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const observer = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastPostElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const loadMorePosts = () => {
    // 추가로 로딩할 포스트가 있다면 이곳에서 처리합니다.
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = async (post) => {
    setSelectedPost(post);
    try {
      const response = await fetchCommentsByPostId(post.postId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPost(null);
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    try {
      await addComment(selectedPost.postId, { content: commentContent });
      const response = await fetchCommentsByPostId(selectedPost.postId);
      setComments(response.data);
      setCommentContent("");
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleLike = async (post) => {
    try {
      if (post.liked) {
        await unlikePost(post.postId);
      } else {
        await likePost(post.postId);
      }
      await loadPosts();
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    try {
      const response = await createPost({ title: newPostTitle, content: newPostContent });
      const postId = response.data.postId;

      if (newPostImage) {
        const formData = new FormData();
        formData.append('image', newPostImage);
        await uploadPostImage(postId, formData);
      }

      await loadPosts(); // 새로운 게시글을 로드합니다.
      closeCreatePostModal();
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImage(null);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleImageChange = (e) => {
    setNewPostImage(e.target.files[0]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="community-content">
      <button onClick={openCreatePostModal} className="create-post-button">새 게시글 작성</button>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-community-posts"
      />

      <div className="posts-list">
        {filteredPosts.map((post, index) => (
          <div
            key={post.postId}
            ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
            className="post-item"
          >
            <div className="card">
              <div className="post-header">
                <h3>{post.userId}</h3>
              </div>
              <div onClick={() => openModal(post)} className={`post-body ${post.thumbnailImageId ? 'with-image' : 'without-image'}`}>
                <p>{post.content}</p>
                {post.thumbnailImageId && <img src={post.thumbnailImageId} alt={post.title} />}
              </div>
              <div className="post-footer">
                <div className="post-stats">
                  <span><FaRegComment /> {post.comments ? post.comments.length : 0}</span>
                  <span><FaRegThumbsUp /> {post.postLikes ? post.postLikes.length : 0}</span>
                </div>
                <div className="post-actions">
                  <button onClick={() => handleLike(post)}><FaHeart /> {post.liked ? 'Unlike' : 'Like'}</button>
                  <button onClick={() => openModal(post)}><FaRegComment /> Comment</button>
                  <button><FaShareSquare /> Share</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Add Comment"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3>{selectedPost.userId}</h3>
              <button className="close-button" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className={`post-body ${selectedPost.thumbnailImageId ? 'with-image' : 'without-image'}`}>
              <p>{selectedPost.content}</p>
              {selectedPost.thumbnailImageId && <img src={selectedPost.thumbnailImageId} alt={selectedPost.title} />}
            </div>
            <div className="post-footer">
              <div className="post-stats">
                <span><FaRegComment /> {comments.length}</span>
                <span><FaHeart /> {selectedPost.postLikes ? selectedPost.postLikes.length : 0}</span>
              </div>
              <div className="post-actions">
                <button onClick={handleLike}><FaHeart /> {selectedPost.liked ? 'Unlike' : 'Like'}</button>
                <button><FaRegComment /> Comment</button>
                <button><FaShareSquare /> Share</button>
              </div>
            </div>
            <div className="comments-section">
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.commentId} className="comment-item">
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment"
            />
          </div>
        </Modal>
      )}

      <Modal
        isOpen={isCreatePostModalOpen}
        onRequestClose={closeCreatePostModal}
        contentLabel="Create Post"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-card">
          <div className="modal-header">
            <h3>새 게시글 작성</h3>
            <button className="close-button" onClick={closeCreatePostModal}><FaTimes /></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              placeholder="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="create-post-title"
            />
            <textarea
              placeholder="Content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="create-post-content"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="create-post-image"
            />
          </div>
          <div className="modal-footer">
            <button onClick={handleCreatePost} className="create-post-button">게시글 작성</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Community;
