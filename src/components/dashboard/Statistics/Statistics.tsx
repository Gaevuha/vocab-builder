import styles from "./Statistics.module.css";

export type StatisticsProps = {
  totalWords: number;
  tasksCount: number;
};

export function Statistics({ tasksCount }: StatisticsProps) {
  return (
    <div className={styles.statistics}>
      <span className={styles.toStudy}>To study:</span>
      <span className={styles.totalWords}>{tasksCount}</span>
    </div>
  );
}
