import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { TrainingTask } from "../../types/training";
import { useState } from "react";

export type TrainingRoomProps = {
  tasks: TrainingTask[];
  onSubmit: (
    answers: Array<{ taskId: string; answer: string }>
  ) => void | Promise<void>;
};

// Yup-схема для однієї відповіді
const answerSchema = yup.object({
  answer: yup.string().required("Answer is required"),
});

type AnswerFormValues = yup.InferType<typeof answerSchema>;

export function TrainingRoom({ tasks, onSubmit }: TrainingRoomProps) {
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
    setAnswers((prev) => [...prev, { taskId: task.id, answer: data.answer }]);
    reset(); // очищаємо поле
    setIndex((prev) => prev + 1);
  };

  const handleSave: SubmitHandler<AnswerFormValues> = (data) => {
    const allAnswers = data.answer.trim()
      ? [...answers, { taskId: task.id, answer: data.answer }]
      : answers;
    onSubmit(allAnswers);
  };

  if (!task) return null;

  return (
    <form
      className="training-room"
      onSubmit={isLast ? handleSubmit(handleSave) : handleSubmit(handleNext)}
    >
      <div className="training-room__left">
        <label className="field">
          <span>Your answer</span>
          <input {...register("answer")} placeholder="Type your answer" />
          {errors.answer && (
            <span className="field__error">{errors.answer.message}</span>
          )}
        </label>
      </div>

      <div className="training-room__right">
        <div className="training-room__task">{task.prompt}</div>
        <div className="training-room__actions">
          {!isLast && <button type="submit">Next</button>}
          {isLast && <button type="submit">Save</button>}
        </div>
      </div>
    </form>
  );
}
