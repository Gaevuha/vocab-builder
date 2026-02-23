export type TrainingTask = {
  id: string;
  question: string;
  en: string;
  ua: string;
  task: "en" | "ua";
};

export type TrainingAnswer = {
  taskId: string;
  taskIndex: number;
  answer: string;
};

export type TrainingSubmitItem = {
  _id: string;
  en: string;
  ua: string;
  task: "en" | "ua";
};
export type TrainingRoomProps = {
  tasks: TrainingTask[];
  onSubmit: (answers: TrainingAnswer[]) => void | Promise<void>;
  onPartialSubmit?: (answers: TrainingAnswer[]) => void | Promise<void>;
};
