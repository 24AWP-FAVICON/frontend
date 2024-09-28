// hooks/useComments.js
import { useState, useEffect } from "react";
import { fetchCommentsByPostId, addComment } from './CommunityApiService';

function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const response = await fetchCommentsByPostId(postId);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const addNewComment = async (content) => {
    try {
      await addComment(postId, { content });
      const response = await fetchCommentsByPostId(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };  

  return { comments, loading, addNewComment };
}

export default useComments;
