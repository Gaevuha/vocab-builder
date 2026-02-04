import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { uiReducer } from "./slices/uiSlice";
import { categoriesReducer } from "./slices/categoriesSlice";
import { wordsReducer } from "./slices/wordsSlice";
import { trainingReducer } from "./slices/trainingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    categories: categoriesReducer,
    words: wordsReducer,
    training: trainingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
