import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import type { TrainingTask } from "../types/training";
import type { TrainingRoomProps } from "../types/training";

const answerSchema = yup.object({
  answer: yup.string().required("Answer is required"),
});

type AnswerFormValues = yup.InferType<typeof answerSchema>;

export function useTrainingRoomState(
  tasks: TrainingTask[],
  onSubmit: TrainingRoomProps["onSubmit"]
) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ taskId: string; answer: string }>
  >([]);

  const task = tasks[index];
  const isLast = index >= tasks.length - 1;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormValues>({
    resolver: yupResolver(answerSchema),
    mode: "onSubmit",
  });

  const handleNext: SubmitHandler<AnswerFormValues> = (data) => {
    if (!task) return;
    setAnswers((prev) => [...prev, { taskId: task.id, answer: data.answer }]);
    reset();
    setIndex((prev) => prev + 1);
  };

  const handleSave: SubmitHandler<AnswerFormValues> = (data) => {
    if (!task) return;
    const allAnswers = data.answer.trim()
      ? [...answers, { taskId: task.id, answer: data.answer }]
      : answers;
    onSubmit(allAnswers);
  };

  return {
    task,
    isLast,
    register,
    handleSubmit,
    errors,
    handleNext,
    handleSave,
  };
}
