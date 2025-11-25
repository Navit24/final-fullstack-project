import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TUser } from "../types/TUser";
import { loginApi, registerApi, updateProfileApi } from "../services/authService";

interface AuthPayload {
  user: TUser;
  token: string;
}

export interface UserSliceState {
  user: TUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const saveToStorage = (payload: AuthPayload | null) => {
  if (payload) {
    localStorage.setItem("user", JSON.stringify(payload.user));
    localStorage.setItem("token", payload.token);
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
};

export const bootstrapUser = createAsyncThunk("user/bootstrap", async () => {
  const storageUser = localStorage.getItem("user");
  const storageToken = localStorage.getItem("token");
  if (!storageUser || !storageToken) return null;
  return { user: JSON.parse(storageUser) as TUser, token: storageToken };
});

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi(credentials);
      saveToStorage(response);
      return response;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to login";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: Parameters<typeof registerApi>[0], { rejectWithValue }) => {
    try {
      const response = await registerApi(data);
      saveToStorage(response);
      return response;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to register";
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    data: Parameters<typeof updateProfileApi>[1],
    { getState, rejectWithValue }
  ) => {
    const state = getState() as { user: UserSliceState };
    if (!state.user.user?._id) {
      return rejectWithValue("User not found");
    }
    try {
      const updated = await updateProfileApi(state.user.user._id, data);
      const token = state.user.token!;
      saveToStorage({ user: updated, token });
      return { user: updated, token };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Profile update failed";
      return rejectWithValue(message);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      saveToStorage(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
