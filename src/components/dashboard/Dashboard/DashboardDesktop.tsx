import { Link } from "react-router-dom";
import { routes } from "../../../app/routes";
import { Filters } from "../Filters/Filters";
import { Statistics } from "../Statistics/Statistics";
import { AddWordBtn } from "../AddWordBtn/AddWordBtn";
import type { DashboardProps } from "../../../types/dashboard";
import styles from "./DashboardDesktop.module.css";

export function DashboardDesktop({
  showAddWord = true,
  onAddWord,
  onSearch,
  onCategoryChange,
  onVerbTypeChange,
  totalWords,
  tasksCount,
}: DashboardProps) {
  return (
    <div className={styles.dashboardWrapper}>
      <Filters
        onSearch={onSearch}
        onCategoryChange={onCategoryChange}
        onVerbTypeChange={onVerbTypeChange}
      />
      <Statistics totalWords={totalWords} tasksCount={tasksCount} />
      <div className={styles.dashboardActions}>
        {showAddWord && onAddWord ? <AddWordBtn onClick={onAddWord} /> : null}
        <Link to={routes.training} className={styles.trainingLink}>
          Train oneself
          <svg className={styles.arrowLinkIcon}>
            <use xlinkHref="/icons/sprite.svg#icon-arrow-right" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
