import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/words";

export type CategoriesState = {
  items: Category[];
};

const initialState: CategoriesState = {
  items: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
    },
  },
});

export const { setCategories } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
