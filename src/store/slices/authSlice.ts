import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/auth";
import { clearToken, loadToken, saveToken } from "../../utils/storage";

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  isAuthenticated: Boolean(loadToken()),
  token: loadToken(),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      saveToken(action.payload.token);
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(state.token);
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      clearToken();
    },
  },
});

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
