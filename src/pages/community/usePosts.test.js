// usePosts.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import usePosts from './hooks/usePosts';
import * as api from './CommunityApiService';

// 모듈 모킹
jest.mock('./CommunityApiService');

describe('usePosts Hook', () => {
  const mockPosts = [
    {
      postId: '1',
      title: 'First Post',
      content: 'This is the first post',
      userId: 'user1@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      postLikes: ['user2@example.com'],
    },
  ];

  const mockComments = [
    { commentId: 'c1', userId: 'user3@example.com', content: 'Nice post!' },
  ];

  beforeEach(() => {
    api.fetchPosts.mockResolvedValue({ data: mockPosts });
    api.fetchCommentsByPostId.mockResolvedValue({ data: mockComments });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and returns posts', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toEqual([
      {
        ...mockPosts[0],
        comments: mockComments,
        commentsCount: mockComments.length,
        likesCount: mockPosts[0].postLikes.length,
        liked: false,
      },
    ]);
  });
});
