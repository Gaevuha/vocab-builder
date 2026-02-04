export type StatisticsProps = {
  totalWords: number;
  tasksCount: number;
};

export function Statistics({ totalWords, tasksCount }: StatisticsProps) {
  return (
    <div className="statistics">
      <div>
        <strong>{totalWords}</strong>
        <span>Words to learn</span>
      </div>
      <div>
        <strong>{tasksCount}</strong>
        <span>Training tasks</span>
      </div>
    </div>
  );
}
