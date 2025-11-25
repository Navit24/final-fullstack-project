import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { MediaItem, TPost } from "../types/TPost";
import {
  getPostsApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  toggleLikePostApi,
  toggleSavePostApi,
  addCommentApi,
  deleteCommentApi,
} from "../services/postService";
import { bootstrapUser, loginUser, logout, registerUser } from "./userSlice";

interface PostState {
  posts: TPost[];
  savedPosts: string[];
  isLoading: boolean;
  error: string | null;
}

interface CreatePostPayload {
  content: string;
  media?: MediaItem[];
}

const initialState: PostState = {
  posts: [],
  savedPosts: [],
  isLoading: false,
  error: null,
};

const markSavedFlags = (posts: TPost[], savedPosts: string[]) =>
  posts.map((post) => ({
    ...post,
    isSaved: savedPosts.includes(post._id),
  }));

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const posts = await getPostsApi();
      return posts;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to fetch posts";
      return rejectWithValue(message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (data: CreatePostPayload, { rejectWithValue }) => {
    try {
      const post = await createPostApi(data);
      return post;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to create post";
      return rejectWithValue(message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    { id, data }: { id: string; data: Partial<CreatePostPayload> },
    { rejectWithValue }
  ) => {
    try {
      const post = await updatePostApi(id, data);
      return post;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to update post";
      return rejectWithValue(message);
    }
  }
);

export const removePost = createAsyncThunk(
  "posts/removePost",
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePostApi(id);
      return id;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to delete post";
      return rejectWithValue(message);
    }
  }
);

export const likePostAsync = createAsyncThunk(
  "posts/likePost",
  async (id: string, { rejectWithValue }) => {
    try {
      const post = await toggleLikePostApi(id);
      return post;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to like post";
      return rejectWithValue(message);
    }
  }
);

export const toggleSavePostAsync = createAsyncThunk(
  "posts/toggleSavePost",
  async (id: string, { rejectWithValue }) => {
    try {
      const post = await toggleSavePostApi(id);
      return post;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to toggle save post";
      return rejectWithValue(message);
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  "posts/addComment",
  async (
    { postId, text }: { postId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const post = await addCommentApi(postId, { text });
      return post;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to add comment";
      return rejectWithValue(message);
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  "posts/deleteComment",
  async (
    { postId, commentId }: { postId: string; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      const post = await deleteCommentApi(postId, commentId);
      return post;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to delete comment";
      return rejectWithValue(message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = markSavedFlags(action.payload, state.savedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.savedPosts = state.savedPosts.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(toggleSavePostAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const wasSaved = state.savedPosts.includes(updated._id);
        const nextSavedIds = wasSaved
          ? state.savedPosts.filter((id) => id !== updated._id)
          : [...state.savedPosts, updated._id];

        const postWithFlag: TPost = {
          ...updated,
          isSaved: !wasSaved,
        };

        const index = state.posts.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.posts[index] = postWithFlag;
        } else {
          state.posts.unshift(postWithFlag);
        }

        state.savedPosts = nextSavedIds;
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(bootstrapUser.fulfilled, (state, action) => {
        if (action.payload?.user.savedPosts) {
          state.savedPosts = action.payload.user.savedPosts;
          state.posts = markSavedFlags(state.posts, state.savedPosts);
        }
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.savedPosts = action.payload.user.savedPosts ?? [];
        state.posts = markSavedFlags(state.posts, state.savedPosts);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.savedPosts = action.payload.user.savedPosts ?? [];
        state.posts = markSavedFlags(state.posts, state.savedPosts);
      })
      .addCase(logout, (state) => {
        state.savedPosts = [];
        state.posts = markSavedFlags(state.posts, []);
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
