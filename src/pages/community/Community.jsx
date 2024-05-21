import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Community.css';

// 더미 데이터
const dummyPosts = [
  { id: 1, 제목: "첫 번째 게시글", 내용: "이것은 첫 번째 게시글의 내용입니다.", 공개여부: true, image_url: "https://via.placeholder.com/150" },
  { id: 2, 제목: "두 번째 게시글", 내용: "이것은 두 번째 게시글의 내용입니다.", 공개여부: false, image_url: "https://via.placeholder.com/150" },
  // 추가 더미 데이터...
];

function Community() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 더미 데이터를 사용하여 게시글 설정
    setPosts(dummyPosts);
  }, []);

  const filteredPosts = posts.filter(post =>
    post.제목.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="community-content">
      <h1>Community Posts</h1>

      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input1"
      />

      <div className="posts-list">
        {filteredPosts.map(post => (
          <Link to={`/community/post/${post.id}`} key={post.id} className="post-item">
            <div className="card">
              <img src={post.image_url} alt={post.제목} />
              <h2>{post.제목}</h2>
              <p>{post.내용}</p>
              <p>{post.공개여부 ? "Public" : "Private"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Community;
