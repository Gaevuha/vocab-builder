import type { TrainingRoomProps } from "../../types/training";
import { useTrainingRoomState } from "../../hooks/useTrainingRoomState";
import styles from "./TrainingRoom.module.css";
import { useNavigate } from "react-router-dom";
import { routes } from "../../app/routes";

export function TrainingRoom({ tasks, onSubmit }: TrainingRoomProps) {
  const {
    task,
    isLast,
    register,
    handleSubmit,
    errors,
    handleNext,
    handleSave,
  } = useTrainingRoomState(tasks, onSubmit);

  const navigate = useNavigate();
  const formId = "training-room-form";

  if (!task) return null;

  const isAnswerUa = task.task === "ua";
  const answerLabel = isAnswerUa ? "Ukrainian" : "English";
  const questionLabel = isAnswerUa ? "English" : "Ukrainian";

  return (
    <>
      <form
        id={formId}
        className={styles.trainingRoom}
        onSubmit={handleSubmit(handleSave)}
      >
        <div className={`${styles.section} ${styles.sectionAnswer}`}>
          <label htmlFor="training-answer" className={styles.visuallyHidden}>
            Your answer
          </label>

          <input
            id="training-answer"
            className={styles.fieldInput}
            {...register("answer")}
            placeholder="Введіть переклад"
          />

          {errors.answer && (
            <span className={styles.fieldError}>{errors.answer.message}</span>
          )}

          <div className={styles.sectionFooter}>
            {!isLast && (
              <button
                type="button"
                className={styles.nextButton}
                onClick={handleNext}
              >
                Next
                <svg className={styles.nextIcon}>
                  <use xlinkHref="/icons/sprite.svg#icon-arrow-right" />
                </svg>
              </button>
            )}

            <div className={styles.languageTag}>
              <svg className={styles.languageIcon}>
                <use xlinkHref="/icons/sprite.svg#icon-ukraine" />
              </svg>
              <span>{answerLabel}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.taskWrap}>
            <div className={styles.task}>{task.question}</div>

            <div className={styles.languageTag}>
              <svg className={styles.languageIcon}>
                <use xlinkHref="/icons/sprite.svg#icon-united-kingdom" />
              </svg>
              <span>{questionLabel}</span>
            </div>
          </div>
        </div>
      </form>

      <div className={styles.mobileFooter}>
        {isLast && (
          <button type="submit" form={formId} className={styles.saveButton}>
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
    </>
  );
}
