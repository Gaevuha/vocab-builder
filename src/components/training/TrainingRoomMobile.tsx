import type { TrainingRoomProps } from "../../types/training";
import { useTrainingRoomState } from "../../hooks/useTrainingRoomState";
import styles from "./TrainingRoom.module.css";
import { useNavigate } from "react-router-dom";
import { routes } from "../../app/routes";

export function TrainingRoomMobile({
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

  console.log("TrainingRoomMobile render", {
    isLast,
    taskId: task?.id,
    total: tasks.length,
  });

  const navigate = useNavigate();

  if (!task) return null;

  return (
    <form
      className={`${styles.trainingRoom} ${styles.trainingRoomMobile}`}
      onSubmit={handleSubmit(handleSave)}
    >
      <div className={`${styles.section} ${styles.sectionAnswer}`}>
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
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.task}>{task.question}</div>
      </div>

      <div className={styles.mobileFooter}>
        {isLast && (
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
        )}

        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => navigate(routes.dictionary)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
