export const API_BASE_URL = "http://localhost:5000/api";

// Various API endpoints
export const API_ENDPOINT = {
  // Authentication
  LOGIN: "/users/login",
  REGISTER: "/users/register",

  // Users management
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,

  // Posts
  POSTS: "/posts",
  POST_BY_ID: (id: string) => `/posts/${id}`,
  MY_POSTS: "/posts/my",
  SAVED_POSTS: "/posts/saved",
  LIKE_POST: (id: string) => `/posts/${id}/like`,
  SAVE_POST: (id: string) => `/posts/${id}/save`,

  // Comments
  COMMENTS: (postId: string) => `/posts/${postId}/comments`,
  COMMENT_ACTION: (postId: string, commentId: string) =>
    `/posts/${postId}/comments/${commentId}`,
};
