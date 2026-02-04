import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "success" | "error" | "info";

export type NotificationState = {
  message: string;
  type: NotificationType;
};

export type UiState = {
  notification: NotificationState | null;
};

const initialState: UiState = {
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<NotificationState>) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const { showNotification, clearNotification } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
