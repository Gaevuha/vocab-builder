import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar/ProgressBar";
import { TrainingRoom } from "../../components/training/TrainingRoom";
import { WellDoneModal } from "../../components/modals/WellDoneModal/WellDoneModal";
import { routes } from "../../app/routes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { showNotification } from "../../store/slices/uiSlice";
import { fetchTrainingTasks, submitTraining } from "../../services/training";
import { setTasks, setProgress } from "../../store/slices/trainingSlice";
import iziToast from "izitoast";
import type {
  TrainingRoomProps,
  TrainingAnswer,
  TrainingSubmitItem,
  TrainingTask,
} from "../../types/training";
import { calculateScore, normalize } from "../../utils/training";
import styles from "./TrainingPage.module.css";

export function TrainingPage() {
  const tasks = useAppSelector((state) => state.training.tasks);
  const progress = useAppSelector((state) => state.training.progress);
  const dictionaryWords = useAppSelector((state) => state.words.items);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ queue для часткових submit
  const partialSubmitQueueRef = useRef<Promise<unknown>>(Promise.resolve());

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
        // fallback
        const trimmedAnswer = answer.answer.trim();
        return {
          _id: answer.taskId,
          en: trimmedAnswer,
          ua: trimmedAnswer,
          task: "en",
        };
      }

      const rawAnswer = answer.answer.trim();
      const expectedEnRaw = dictionaryWord?.en ?? task.en ?? "";
      const expectedUaRaw = dictionaryWord?.ua ?? task.ua ?? "";
      const answerNorm = normalize(rawAnswer);
      const expectedEnNorm = normalize(expectedEnRaw);
      const expectedUaNorm = normalize(expectedUaRaw);

      const matchesExpectedEn =
        expectedEnRaw.length > 0 && expectedEnNorm === answerNorm;
      const matchesExpectedUa =
        expectedUaRaw.length > 0 && expectedUaNorm === answerNorm;

      const canonicalAnswer = matchesExpectedEn
        ? expectedEnRaw
        : matchesExpectedUa
        ? expectedUaRaw
        : rawAnswer;

      return {
        _id: answer.taskId,
        en: task.task === "en" ? canonicalAnswer : expectedEnRaw,
        ua: task.task === "ua" ? canonicalAnswer : expectedUaRaw,
        task: task.task,
      };
    });
  };

  // Часткове збереження
  const handlePartialSubmit: NonNullable<
    TrainingRoomProps["onPartialSubmit"]
  > = async (answers) => {
    if (!answers.length) return;

    const payload = buildPayload(answers);

    partialSubmitQueueRef.current = partialSubmitQueueRef.current.then(() =>
      submitTraining(payload)
    );

    await partialSubmitQueueRef.current;
  };

  // Фінальне збереження + score
  const handleSubmit: TrainingRoomProps["onSubmit"] = async (answers) => {
    try {
      await partialSubmitQueueRef.current;

      const payload = buildPayload(answers);
      await submitTraining(payload);

      // 🔹 рахуємо score з нормалізацією
      const finalScore = calculateScore(tasks, answers);
      setScore(finalScore);

      setModalOpen(true);
      partialSubmitQueueRef.current = Promise.resolve();
    } catch (error) {
      partialSubmitQueueRef.current = Promise.resolve();

      iziToast.error({
        title: "Помилка",
        message:
          error instanceof Error ? error.message : "Training save failed",
        position: "topRight",
      });

      navigate(routes.dictionary, { replace: true });
    }
  };

  if (loading) {
    return (
      <section className={styles.trainingPage}>
        <h1>Training</h1>
        <p>Loading...</p>
      </section>
    );
  }

  if (!tasks.length) {
    return (
      <section className={styles.trainingPage}>
        <h1>Training</h1>
        <p>
          No tasks yet. <Link to={`${routes.dictionary}?add=1`}>Add word</Link>
        </p>
      </section>
    );
  }

  return (
    <section className={styles.trainingPage}>
      <h1>Training</h1>

      <div className={styles.trainingProgress}>
        <ProgressBar value={progress} max={tasks.length} showValue />
      </div>

      <TrainingRoom
        tasks={tasks}
        onSubmit={handleSubmit}
        onPartialSubmit={handlePartialSubmit}
      />

      <WellDoneModal
        isOpen={modalOpen}
        score={score}
        onClose={() => {
          setModalOpen(false);
          navigate(routes.dictionary, { replace: true });
        }}
      />
    </section>
  );
}
