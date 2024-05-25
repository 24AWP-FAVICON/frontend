import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './Community.css';

const dummyPosts = [
  { id: 1, 제목: "첫 번째 게시글", 내용: "이것은 첫 번째 게시글의 내용입니다.", 공개여부: true, image_url: "https://via.placeholder.com/150", user_id: 1 },
  { id: 2, 제목: "두 번째 게시글", 내용: "이것은 두 번째 게시글의 내용입니다.", 공개여부: false, image_url: "https://via.placeholder.com/150", user_id: 2 },
];

const dummyComments = [
  { id: 1, post_id: 1, 내용: "첫 번째 댓글입니다." },
  { id: 2, post_id: 1, 내용: "두 번째 댓글입니다." },
];

function PostDetail() {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // 더미 데이터를 사용하여 게시글 및 댓글 설정
    const post = dummyPosts.find(p => p.id === parseInt(post_id));
    setPost(post);
    setComments(dummyComments.filter(c => c.post_id === parseInt(post_id)));
  }, [post_id]);

  const handleAddComment = () => {
    const newComment = { id: comments.length + 1, post_id: parseInt(post_id), 내용: commentContent };

    setComments([...comments, newComment]);
    setCommentContent("");
  };

  const handleFollow = () => {
    setIsFollowing(true);
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail">
      <div className="post-image">
        <img src={post.image_url} alt={post.제목} />
      </div>
      <div className="post-content">
        <h1>{post.제목}</h1>
        <p>{post.내용}</p>
        <div className="follow-buttons">
          {isFollowing ? (
            <button onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={handleFollow}>Follow</button>
          )}
        </div>
        <div className="comments-section">
          <h2>Comments</h2>
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <p>{comment.내용}</p>
              </div>
            ))}
          </div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
