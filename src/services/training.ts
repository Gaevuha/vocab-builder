import { request } from "./api";
import type { TrainingTask } from "../types/training";

export function fetchTrainingTasks() {
  return request<TrainingTask[]>("/training/tasks");
}

export function submitTraining(payload: {
  answers: Array<{ taskId: string; answer: string }>;
}) {
  return request<{ score: number }>("/training/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
