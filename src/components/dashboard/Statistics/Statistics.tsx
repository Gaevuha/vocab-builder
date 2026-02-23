import styles from "./Statistics.module.css";

export type StatisticsProps = {
  totalWords: number;
  tasksCount: number;
};

export function Statistics({ totalWords }: StatisticsProps) {
  return (
    <div className={styles.statistics}>
      <span className={styles.toStudy}>To study:</span>
      <span className={styles.totalWords}>{totalWords}</span>
    </div>
  );
}
