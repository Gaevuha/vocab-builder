import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Word } from "../../types/words";

export type WordsState = {
  items: Word[];
  total: number;
  page: number;
  perPage: number;
};

const initialState: WordsState = {
  items: [],
  total: 0,
  page: 1,
  perPage: 10,
};

const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    setWords(state, action: PayloadAction<{ items: Word[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setWords, setPage } = wordsSlice.actions;
export const wordsReducer = wordsSlice.reducer;
