export type TrainingTask = {
  id: string;
  question: string;
};
export type TrainingRoomProps = {
  tasks: TrainingTask[];
  onSubmit: (
    answers: Array<{ taskId: string; answer: string }>
  ) => void | Promise<void>;
};
