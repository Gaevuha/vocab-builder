import type { TrainingAnswer, TrainingTask } from "../types/training";

export const normalize = (value: string): string =>
  value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("uk-UA")
    .replace(/[’'ʼ`´]/g, "'")
    .replace(/\s+/g, " ");

export const isCorrectAnswer = (
  task: TrainingTask,
  userValue: string
): boolean => {
  const correctValue = task.task === "en" ? task.en : task.ua;
  return normalize(userValue) === normalize(correctValue);
};

export const calculateScore = (
  tasks: TrainingTask[],
  answers: TrainingAnswer[]
): number => {
  return answers.reduce((score, answer) => {
    const task = tasks.find((t) => t.id === answer.taskId);
    if (!task) return score;
    return isCorrectAnswer(task, answer.answer) ? score + 1 : score;
  }, 0);
};
