import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchUserPosts } from '../community/CommunityApiService'; // API 서비스 가져오기
import './UserProfile.css'; // 사용자 정의 스타일

function UserProfile() {
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = Cookies.get("access");

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/info`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          return data.userId;
        } else {
          console.error('Failed to fetch user info');
          return null;
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
        return null;
      }
    };

    const fetchPosts = async (userId) => {
      try {
        const response = await fetchUserPosts(userId);
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    const initialize = async () => {
      const userId = await fetchUserInfo();
      if (userId) {
        fetchPosts(userId);
      }
    };

    initialize();
  }, []);

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="user-profile-header">
          {userInfo ? (
            <div className="user-profile-info">
              <img src={`${process.env.PUBLIC_URL}/HeaderLogo.png`} alt="Profile" className="user-profile-image"/>
              <div>
                <h2 className="user-profile-name">{userInfo.nickname}</h2>
                <p className="user-profile-email">{userInfo.userId}</p>
              </div>
            </div>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>
      </div>
      <div className="user-posts-container">
        <h2 className="user-posts-title">User's Posts</h2>
        <div className="user-posts-cards">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.postId} className="user-post-card">
                <div className="user-post-header">
                  <h3>{post.title}</h3>
                </div>
                <div className="user-post-body">
                  <p>{post.content}</p>
                  {post.thumbnailImageId && <img src={post.thumbnailImageId} alt={post.title} />}
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;