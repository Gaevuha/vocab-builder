import type { TrainingRoomProps } from "../../types/training";
import { useTrainingRoomState } from "../../hooks/useTrainingRoomState";

export function TrainingRoomMobile({ tasks, onSubmit }: TrainingRoomProps) {
  const {
    task,
    isLast,
    register,
    handleSubmit,
    errors,
    handleNext,
    handleSave,
  } = useTrainingRoomState(tasks, onSubmit);

  if (!task) return null;

  return (
    <form
      className="training-room training-room--mobile"
      onSubmit={isLast ? handleSubmit(handleSave) : handleSubmit(handleNext)}
    >
      <div className="training-room__task">{task.question}</div>
      <label className="field">
        <span>Your answer</span>
        <input {...register("answer")} placeholder="Type your answer" />
        {errors.answer && (
          <span className="field__error">{errors.answer.message}</span>
        )}
      </label>
      <div className="training-room__actions">
        {!isLast && <button type="submit">Next</button>}
        {isLast && <button type="submit">Save</button>}
      </div>
    </form>
  );
}
