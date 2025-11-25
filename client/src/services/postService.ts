import { API_ENDPOINT } from "../config/api";
import apiClient from "./apiClient";
import type { TComment } from "../types/TComment";
import type { MediaItem, TPost } from "../types/TPost";

interface CreatePostData {
  content: string;
  media?: MediaItem[];
}

interface UpdatePostData {
  content?: string;
  media?: MediaItem[];
}

interface CreateCommentData {
  text: string;
}

// Get all posts
export const getPostsApi = async (): Promise<TPost[]> => {
  const response = await apiClient.get<TPost[]>(API_ENDPOINT.POSTS);
  return response.data;
};

// Get single post
export const getPostByIdApi = async (id: string): Promise<TPost> => {
  const response = await apiClient.get<TPost>(API_ENDPOINT.POST_BY_ID(id));
  return response.data;
};

// Create a new post
export const createPostApi = async (data: CreatePostData): Promise<TPost> => {
  const response = await apiClient.post<TPost>(API_ENDPOINT.POSTS, data);
  return response.data;
};

// Update a post
export const updatePostApi = async (
  id: string,
  data: UpdatePostData
): Promise<TPost> => {
  const response = await apiClient.put<TPost>(
    API_ENDPOINT.POST_BY_ID(id),
    data
  );
  return response.data;
};

// Delete a post
export const deletePostApi = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINT.POST_BY_ID(id));
};

// Like / Unlike post
export const toggleLikePostApi = async (id: string): Promise<TPost> => {
  const response = await apiClient.post<TPost>(API_ENDPOINT.LIKE_POST(id));
  return response.data;
};

// Save / Unsave post
export const toggleSavePostApi = async (id: string): Promise<TPost> => {
  const response = await apiClient.post<TPost>(API_ENDPOINT.SAVE_POST(id));
  return response.data;
};

// Get saved posts
export const getSavedPostsApi = async (): Promise<TPost[]> => {
  const response = await apiClient.get<TPost[]>(API_ENDPOINT.SAVED_POSTS);
  return response.data;
};

// Get comments for a post
export const getCommentsApi = async (postId: string): Promise<TComment[]> => {
  const response = await apiClient.get<TComment[]>(
    API_ENDPOINT.COMMENTS(postId)
  );
  return response.data;
};

// Add comment to a post
export const addCommentApi = async (
  postId: string,
  data: CreateCommentData
): Promise<TPost> => {
  const response = await apiClient.post<TPost>(
    API_ENDPOINT.COMMENTS(postId),
    data
  );
  return response.data;
};

// Delete comment
export const deleteCommentApi = async (
  postId: string,
  commentId: string
): Promise<TPost> => {
  const response = await apiClient.delete<TPost>(
    `${API_ENDPOINT.COMMENTS(postId)}/${commentId}`
  );
  return response.data;
};
