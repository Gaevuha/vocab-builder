import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Word } from "../../types/words";

export type WordsState = {
  items: Word[];
  totalPages: number;
  page: number;
  perPage: number;
};

const initialState: WordsState = {
  items: [],
  totalPages: 0,
  page: 1,
  perPage: 7,
};

const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    setWords(
      state,
      action: PayloadAction<{
        items: Word[];
        totalPages: number;
        perPage?: number;
      }>
    ) {
      state.items = action.payload.items;
      state.totalPages = action.payload.totalPages;
      if (
        typeof action.payload.perPage === "number" &&
        action.payload.perPage > 0 &&
        action.payload.perPage !== state.perPage
      ) {
        state.perPage = action.payload.perPage;
      }
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setWords, setPage } = wordsSlice.actions;
export const wordsReducer = wordsSlice.reducer;
