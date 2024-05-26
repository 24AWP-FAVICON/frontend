import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaRegComment, FaRegThumbsUp, FaShareSquare, FaTimes, FaHeart } from "react-icons/fa";
import Modal from "react-modal";
import './Community.css';

const dummyPosts = [
  { id: 1, 제목: "첫 번째 게시글", 내용: "이것은 첫 번째 게시글의 내용입니다.", 공개여부: true, image_url: "https://via.placeholder.com/600x300", likes: 0, comments: 2, 작성자: "사용자1" },
  { id: 2, 제목: "두 번째 게시글", 내용: "이것은 두 번째 게시글의 내용입니다.", 공개여부: false, image_url: "", likes: 0, comments: 0, 작성자: "사용자2" },
  { id: 3, 제목: "세 번째 게시글", 내용: "이것은 세 번째 게시글의 내용입니다.", 공개여부: true, image_url: "https://via.placeholder.com/600x300", likes: 3, comments: 1, 작성자: "사용자3" },
  { id: 4, 제목: "네 번째 게시글", 내용: "이것은 네 번째 게시글의 내용입니다.", 공개여부: true, image_url: "", likes: 1, comments: 0, 작성자: "사용자4" },
];

const dummyComments = [
  { id: 1, post_id: 1, 내용: "첫 번째 댓글입니다." },
  { id: 2, post_id: 1, 내용: "두 번째 댓글입니다." },
  { id: 3, post_id: 1, 내용: "세 번째 댓글입니다." },
];

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

  useEffect(() => {
    const sortedPosts = [...dummyPosts].sort((a, b) => b.id - a.id);
    setPosts(sortedPosts);
  }, []);

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
    const newPosts = dummyPosts.slice(page * 4, (page + 1) * 4);
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setPage(prevPage => prevPage + 1);
  };

  const filteredPosts = posts.filter(post =>
    post.제목.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (post) => {
    setSelectedPost(post);
    setComments(dummyComments.filter(c => c.post_id === post.id));
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPost(null);
  };

  const handleAddComment = () => {
    const newComment = { id: comments.length + 1, post_id: selectedPost.id, 내용: commentContent };
    setComments([...comments, newComment]);
    setCommentContent("");
  };

  const handleLike = () => {
    setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="community-content">
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
            key={post.id}
            ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
            className="post-item"
          >
            <div className="card">
              <div className="post-header">
                <h3>{post.작성자}</h3>
              </div>
              <div onClick={() => openModal(post)} className={`post-body ${post.image_url ? 'with-image' : 'without-image'}`}>
                <p>{post.내용}</p>
                {post.image_url && <img src={post.image_url} alt={post.제목} />}
              </div>
              <div className="post-footer">
                <div className="post-stats">
                  <span><FaRegComment /> {post.comments}</span>
                  <span><FaRegThumbsUp /> {post.likes}</span>
                </div>
                <div className="post-actions">
                  <button onClick={() => handleLike(post)}><FaHeart /> 좋아요</button>
                  <button onClick={() => openModal(post)}><FaRegComment /> 댓글 작성하기</button>
                  <button><FaShareSquare /> 공유하기</button>
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
          contentLabel="댓글 작성하기"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3>{selectedPost.작성자}</h3>
              <button className="close-button" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className={`post-body ${selectedPost.image_url ? 'with-image' : 'without-image'}`}>
              <p>{selectedPost.내용}</p>
              {selectedPost.image_url && <img src={selectedPost.image_url} alt={selectedPost.제목} />}
            </div>
            <div className="post-footer">
              <div className="post-stats">
                <span><FaRegComment /> {comments.length}</span>
                <span><FaRegThumbsUp /> {selectedPost.likes}</span>
              </div>
              <div className="post-actions">
                  <button onClick={() => handleLike(selectedPost)}><FaHeart /> 좋아요</button>
                  <button onClick={() => openModal(selectedPost)}><FaRegComment /> 댓글 작성하기</button>
                  <button><FaShareSquare /> 공유하기</button>
                </div>
            </div>
            <div className="comments-section">
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <p>{comment.내용}</p>
                  </div>
                ))}
              </div>
            </div>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="댓글을 작성해주세요."
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Community;
