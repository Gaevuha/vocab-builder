import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TrainingTask } from "../../types/training";

export type TrainingState = {
  tasks: TrainingTask[];
  progress: number;
};

const initialState: TrainingState = {
  tasks: [],
  progress: 0,
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TrainingTask[]>) {
      state.tasks = action.payload;
      state.progress = 0;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
  },
});

export const { setTasks, setProgress } = trainingSlice.actions;
export const trainingReducer = trainingSlice.reducer;
