import { useState, useEffect } from "react";
import { fetchPosts, fetchCommentsByPostId } from '../CommunityApiService';

function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
          liked: false
        };
      }));
      const sortedPosts = postsWithCommentsAndLikes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return { posts, setPosts, loading, loadPosts };
}

export default usePosts;