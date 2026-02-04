import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/common/ProgressBar/ProgressBar";
import { TrainingRoom } from "../../components/training/TrainingRoom";
import { WellDoneModal } from "../../components/modals/WellDoneModal/WellDoneModal";
import { routes } from "../../app/routes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { showNotification } from "../../store/slices/uiSlice";

export function TrainingPage() {
  const tasks = useAppSelector((state) => state.training.tasks);
  const progress = useAppSelector((state) => state.training.progress);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit() {
    try {
      setScore(0);
      setModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Training save failed";
      dispatch(showNotification({ message, type: "error" }));
      navigate(routes.dictionary, { replace: true });
    }
  }

  if (!tasks.length) {
    return (
      <section className="page">
        <h1>Training</h1>
        <p>
          No tasks yet. <Link to={routes.dictionary}>Add word</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Training</h1>
      <ProgressBar value={progress} max={tasks.length} />
      <TrainingRoom tasks={tasks} onSubmit={handleSubmit} />
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
