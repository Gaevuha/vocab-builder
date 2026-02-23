import type { TrainingRoomProps } from "../../types/training";
import { useTrainingRoomState } from "../../hooks/useTrainingRoomState";
import styles from "./TrainingRoom.module.css";

export function TrainingRoomDesktop({
  tasks,
  onSubmit,
  onPartialSubmit,
}: TrainingRoomProps) {
  const {
    task,
    isLast,
    register,
    handleSubmit,
    errors,
    handleNext,
    handleSave,
  } = useTrainingRoomState(tasks, onSubmit, onPartialSubmit);

  console.log("TrainingRoomDesktop render", {
    isLast,
    taskId: task?.id,
    total: tasks.length,
  });

  if (!task) return null;

  return (
    <form
      className={`${styles.trainingRoom} ${styles.trainingRoomDesktop}`}
      onSubmit={handleSubmit(handleSave)}
    >
      <div className={styles.left}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Your answer</span>
          <input
            className={styles.fieldInput}
            {...register("answer")}
            placeholder="Type your answer"
          />

          {errors.answer && (
            <span className={styles.fieldError}>{errors.answer.message}</span>
          )}
        </label>
      </div>

      <div className={styles.right}>
        <div className={styles.task}>{task.question}</div>
        <div className={styles.actions}>
          {!isLast && (
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {isLast && (
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
