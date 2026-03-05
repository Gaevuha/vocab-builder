import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import type {
  TrainingAnswer,
  TrainingTask,
  TrainingRoomProps,
} from "../types/training";
import { useAppDispatch } from "../store/hooks";
import { setProgress } from "../store/slices/trainingSlice";

type AnswerFormValues = {
  answer: string;
};

export function useTrainingRoomState(
  tasks: TrainingTask[],
  onSubmit: TrainingRoomProps["onSubmit"]
) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TrainingAnswer[]>([]);
  const dispatch = useAppDispatch();

  const task = tasks[index];
  const isLast = tasks.length > 0 && index === tasks.length - 1;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<AnswerFormValues>({ mode: "onSubmit" });

  // progress sync
  useEffect(() => {
    dispatch(setProgress(answers.length));
  }, [answers.length, dispatch]);

  const upsertAnswer = (
    prev: TrainingAnswer[],
    next: TrainingAnswer
  ): TrainingAnswer[] => {
    const filtered = prev.filter((a) => a.taskIndex !== next.taskIndex);
    return [...filtered, next];
  };

  const handleNext = () => {
    if (!task) return;

    const value = getValues("answer")?.trim();
    if (value) {
      const newAnswer: TrainingAnswer = {
        taskId: task.id,
        taskIndex: index,
        answer: value,
      };

      const updated = upsertAnswer(answers, newAnswer);
      setAnswers(updated);
    }

    reset();
    setIndex((prev) => Math.min(prev + 1, tasks.length - 1));
  };

  const handleSave: SubmitHandler<AnswerFormValues> = async (data) => {
    if (!task) return;

    const value = data.answer.trim();
    let updated = answers;

    if (value) {
      const newAnswer: TrainingAnswer = {
        taskId: task.id,
        taskIndex: index,
        answer: value,
      };

      updated = upsertAnswer(answers, newAnswer);
      setAnswers(updated);
    }

    await Promise.resolve(onSubmit(updated));
  };

  return {
    task,
    isLast,
    register,
    handleSubmit,
    errors,
    handleNext,
    handleSave,
    answers,
  };
}
