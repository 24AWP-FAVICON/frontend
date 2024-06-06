import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaRegComment, FaRegThumbsUp, FaShareSquare, FaTimes, FaHeart, FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import './Community.css';
import {
  fetchPosts,
  createPost,
  likePost,
  unlikePost,
  fetchCommentsByPostId,
  addComment,
  uploadPostImage,
  updatePost
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
  const [newPostImages, setNewPostImages] = useState([]); // 이미지 배열로 변경
  const [showHeart, setShowHeart] = useState(false); // 하트 애니메이션 상태
  const [showUnlikeHeart, setShowUnlikeHeart] = useState(false); // 파란 하트 애니메이션 상태

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchPosts();
      const postsWithCommentsAndLikes = await Promise.all(response.data.map(async (post) => {
        const commentsResponse = await fetchCommentsByPostId(post.postId);
        return {
          ...post,
          comments: commentsResponse.data,
          commentsCount: commentsResponse.data.length,
          likesCount: post.postLikes ? post.postLikes.length : 0,
          liked: false // 기본값을 false로 설정
        };
      }));
      // 최신순으로 정렬
      const sortedPosts = postsWithCommentsAndLikes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
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

      // 댓글 수 업데이트
      const updatedPosts = posts.map(post => {
        if (post.postId === selectedPost.postId) {
          return { ...post, comments: response.data, commentsCount: response.data.length };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleLike = async (post) => {
    try {
      if (post.liked) {
        await unlikePost(post.postId);
        setShowUnlikeHeart(true); // 파란 하트 애니메이션 시작
        setTimeout(() => setShowUnlikeHeart(false), 1000); // 1초 후 애니메이션 숨김
        let updatedPost = { ...post, liked: false, likesCount: post.likesCount - 1 };
        setPosts(posts.map(p => p.postId === post.postId ? updatedPost : p));
        if (selectedPost && selectedPost.postId === post.postId) {
          setSelectedPost(updatedPost);
        }
      } else {
        await likePost(post.postId);
        setShowHeart(true); // 빨간 하트 애니메이션 시작
        setTimeout(() => setShowHeart(false), 1000); // 1초 후 애니메이션 숨김
        let updatedPost = { ...post, liked: true, likesCount: post.likesCount + 1 };
        setPosts(posts.map(p => p.postId === post.postId ? updatedPost : p));
        if (selectedPost && selectedPost.postId === post.postId) {
          setSelectedPost(updatedPost);
        }
      }
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
  
      if (newPostImages.length > 0) {
        const formData = new FormData();
        newPostImages.forEach((image, index) => {
          formData.append('image', image); // FormData에 이미지 파일 추가
        });
  
        const uploadResponse = await uploadPostImage(postId, formData);
        const imageUrls = uploadResponse.data;
  
        await updatePost(postId, {
          title: newPostTitle,
          content: newPostContent,
          thumbnailImageIds: imageUrls
        });
      }
  
      await loadPosts(); // 새로운 게시글을 로드합니다.
      closeCreatePostModal();
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImages([]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleImageChange = (e) => {
    setNewPostImages([...e.target.files]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="community-content">
      <div className="search-and-create">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-community-posts"
        />
        <button onClick={openCreatePostModal} className="create-post-button">
          <FaPlus />
        </button>
      </div>

      <div className="posts-list">
        {filteredPosts.map((post, index) => (
          <div
            key={post.postId}
            ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
            className="post-item"
          >
            <div className="card">
              <div className="post-header">
                <h3>{post.title}</h3>
              </div>
              <div onClick={() => openModal(post)} className={`post-body ${post.thumbnailImageId ? 'with-image' : 'without-image'}`}>
                <p>{post.content}</p>
                {post.thumbnailImageId && <img src={post.thumbnailImageId} alt={post.title} />}
              </div>
              <div className="post-footer">
                <div className="post-stats">
                  <span><FaRegComment /> {post.commentsCount}</span>
                  <span><FaRegThumbsUp /> {post.likesCount}</span>
                </div>
                <div className="post-actions">
                  <button onClick={() => handleLike(post)}><FaHeart /> {post.liked ? 'Unlike' : 'Like'}</button>
                  <button onClick={() => openModal(post)}><FaRegComment /> Comment</button>
                  <button><FaShareSquare /> Share</button>
                </div>
              </div>
              {showHeart && <FaHeart className="heart-animation" />} {/* 빨간 하트 애니메이션 */}
              {showUnlikeHeart && <FaHeart className="unlike-heart-animation" />} {/* 파란 하트 애니메이션 */}
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
              <div className="profile-info">
                <img src={`${process.env.PUBLIC_URL}/profile.png`} alt="Profile" className="profile-image" />
                <h3>{selectedPost.userId}</h3>
              </div>
              <button className="close-button" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className={`post-body ${selectedPost.thumbnailImageId ? 'with-image' : 'without-image'}`}>
              <p>{selectedPost.content}</p>
              {selectedPost.thumbnailImageId && <img src={selectedPost.thumbnailImageId} alt={selectedPost.title} />}
            </div>
            <div className="post-footer">
              <div className="post-stats">
                <span><FaRegComment /> {comments.length}</span>
                <span><FaHeart /> {selectedPost.likesCount}</span>
              </div>
              <div className="post-actions">
                <button onClick={() => handleLike(selectedPost)}><FaHeart /> {selectedPost.liked ? 'Unlike' : 'Like'}</button>
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
            <h3>Create New Post</h3>
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
              multiple
              onChange={handleImageChange}
              className="create-post-image"
            />
            {newPostImages.length > 0 && (
              <div className="selected-images">
                {Array.from(newPostImages).map((image, index) => (
                  <div key={index} className="image-preview">
                    <span>{image.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={handleCreatePost} className="create-post-button">Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Community;