// src/services/training.ts
import { api, ApiError } from "./api";
import type { TrainingTask } from "../types/training";

export async function fetchTrainingTasks(): Promise<TrainingTask[]> {
  try {
    const res = await api.get<TrainingTask[]>("/words/tasks");
    return res.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to fetch training tasks", 500);
  }
}

export async function submitTraining(payload: {
  answers: Array<{ taskId: string; answer: string }>;
}) {
  try {
    const res = await api.post<{ score: number }>("/words/answers", payload);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to submit training", 500);
  }
}
