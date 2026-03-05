import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar/ProgressBar";
import { TrainingRoom } from "../../components/training/TrainingRoom";
import { WellDoneModal } from "../../components/modals/WellDoneModal/WellDoneModal";
import { routes } from "../../app/routes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { showNotification } from "../../store/slices/uiSlice";
import { fetchTrainingTasks, submitTraining } from "../../services/training";
import { setTasks, setProgress } from "../../store/slices/trainingSlice";

import type {
  TrainingRoomProps,
  TrainingAnswer,
  TrainingSubmitItem,
  TrainingTask,
} from "../../types/training";
import { normalize } from "../../utils/training";
import styles from "./TrainingPage.module.css";

type TrainingResult = {
  correctAnswers: string[];
  mistakes: string[];
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const pickCanonicalMatch = (
  input: string,
  candidates: Array<string | undefined>
) => {
  const normalizedInput = normalize(input);
  return candidates.find(
    (candidate) =>
      isNonEmptyString(candidate) && normalize(candidate) === normalizedInput
  );
};

export function TrainingPage() {
  const tasks = useAppSelector((state) => state.training.tasks);
  const progress = useAppSelector((state) => state.training.progress);
  const dictionaryWords = useAppSelector((state) => state.words.items);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [result, setResult] = useState<TrainingResult>({
    correctAnswers: [],
    mistakes: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Завантаження завдань
  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        setLoading(true);

        const tasksData: TrainingTask[] = await fetchTrainingTasks();

        if (!isMounted) return;

        dispatch(setTasks(tasksData));
        dispatch(setProgress(0));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load training";

        dispatch(showNotification({ message, type: "error" }));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // 🔹 трансформуємо answers у payload для бекенду
  const buildPayload = (answers: TrainingAnswer[]): TrainingSubmitItem[] => {
    return answers.map((answer) => {
      const task = tasks.find((t) => t.id === answer.taskId);
      const dictionaryWord = dictionaryWords.find(
        (w) => w.id === answer.taskId
      );

      if (!task) {
        const trimmedAnswer = answer.answer.trim();
        return {
          _id: answer.taskId,
          en: trimmedAnswer,
          ua: trimmedAnswer,
          task: "en",
        };
      }

      const rawAnswer = answer.answer.trim();
      const enCandidates = [dictionaryWord?.en, task.en];
      const uaCandidates = [dictionaryWord?.ua, task.ua];

      const matchedEn = pickCanonicalMatch(rawAnswer, enCandidates);
      const matchedUa = pickCanonicalMatch(rawAnswer, uaCandidates);

      const canonicalAnswer = matchedEn ?? matchedUa ?? rawAnswer;
      const expectedEnRaw = enCandidates.find(isNonEmptyString) ?? "";
      const expectedUaRaw = uaCandidates.find(isNonEmptyString) ?? "";

      return {
        _id: answer.taskId,
        en: task.task === "en" ? canonicalAnswer : expectedEnRaw,
        ua: task.task === "ua" ? canonicalAnswer : expectedUaRaw,
        task: task.task,
      };
    });
  };

  // Фінальне збереження + score
  const handleSubmit: TrainingRoomProps["onSubmit"] = async (answers) => {
    try {
      const payload = buildPayload(answers);
      await submitTraining(payload);

      const answersByTaskId = new Map(
        answers.map((answer) => [answer.taskId, answer.answer])
      );

      const correctAnswers: string[] = [];
      const mistakes: string[] = [];

      tasks.forEach((task) => {
        const userAnswer = answersByTaskId.get(task.id);
        const dictionaryWord = dictionaryWords.find(
          (word) => word.id === task.id
        );
        const wordLabel =
          task.question ||
          (task.task === "en"
            ? dictionaryWord?.ua || task.ua || dictionaryWord?.en || task.en
            : dictionaryWord?.en || task.en || dictionaryWord?.ua || task.ua);

        if (!userAnswer) {
          mistakes.push(wordLabel);
          return;
        }

        const normalizedAnswer = normalize(userAnswer);
        const directionExpected =
          task.task === "en"
            ? [dictionaryWord?.en, task.en]
            : [dictionaryWord?.ua, task.ua];

        const fallbackExpected = [
          dictionaryWord?.en,
          dictionaryWord?.ua,
          task.en,
          task.ua,
        ];

        const expectedValues = (
          directionExpected.some(Boolean) ? directionExpected : fallbackExpected
        )
          .filter(isNonEmptyString)
          .map((value) => normalize(value));

        if (expectedValues.includes(normalizedAnswer)) {
          correctAnswers.push(wordLabel);
          return;
        }

        mistakes.push(wordLabel);
      });

      setResult({ correctAnswers, mistakes });

      setModalOpen(true);
    } catch {
      dispatch(
        showNotification({
          message: "Current progress was not saved",
          type: "error",
        })
      );

      navigate(routes.dictionary, { replace: true });
    }
  };

  if (loading) {
    return (
      <section className={styles.trainingPage}>
        <div className="container">
          <h1 className="visually-hidden">Training</h1>
          <div className={styles.loadingState}>Loading...</div>
        </div>
      </section>
    );
  }

  if (!tasks.length) {
    return (
      <section className={styles.trainingPage}>
        <div className={`${styles.containerEmpty} container`}>
          <div className={styles.emptyState}>
            <div className={styles.wrapperImgTraining}>
              <picture>
                <source
                  srcSet="/img/blood-report-tablet.webp 1x, /img/blood-report-tablet@2x.webp 2x"
                  media="(min-width: 768px)"
                />
                <img
                  src="/img/blood-report-mobile.webp"
                  srcSet="/img/blood-report-mobile.webp 1x, /img/blood-report-mobile@2x.webp 2x"
                  alt="Illustration"
                  className={styles.imgTraining}
                />
              </picture>
            </div>
            <div className={styles.wrapperContent}>
              <p className={styles.emptyTitle}>
                You don&apos;t have a single word to learn right now.
              </p>

              <p className={styles.emptyText}>
                Please create or add a word to start the workout. We want to
                improve your vocabulary and develop your knowledge, so please
                share the words you are interested in adding to your study.
              </p>

              <div className={styles.emptyActions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => navigate(`${routes.dictionary}?add=1`)}
                >
                  Add word
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => navigate(routes.dictionary)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.trainingPage} ${styles.trainingPageNoEmpty}`}>
      <div className={`${styles.containerNoEmpty} container`}>
        <div className={styles.trainingProgress}>
          <ProgressBar
            value={progress}
            max={tasks.length}
            className={styles.trainingProgressBar}
            showValue
            strokeWidth={9}
          />
        </div>

        <TrainingRoom tasks={tasks} onSubmit={handleSubmit} />
      </div>

      <WellDoneModal
        isOpen={modalOpen}
        correctAnswers={result.correctAnswers}
        mistakes={result.mistakes}
        onClose={() => {
          setModalOpen(false);
          navigate(routes.dictionary, { replace: true });
        }}
      />
    </section>
  );
}
