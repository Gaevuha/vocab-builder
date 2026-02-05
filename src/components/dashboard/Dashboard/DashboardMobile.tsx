import { Link } from "react-router-dom";
import { routes } from "../../../app/routes";
import { Filters } from "../Filters/Filters";
import { Statistics } from "../Statistics/Statistics";
import { AddWordBtn } from "../AddWordBtn/AddWordBtn";
import type { DashboardProps } from "../../../types/dashboard";

export function DashboardMobile({
  showAddWord = true,
  onAddWord,
  onSearch,
  onCategoryChange,
  onVerbTypeChange,
  totalWords,
  tasksCount,
}: DashboardProps) {
  return (
    <section className="dashboard dashboard--mobile">
      <Filters
        onSearch={onSearch}
        onCategoryChange={onCategoryChange}
        onVerbTypeChange={onVerbTypeChange}
      />
      <Statistics totalWords={totalWords} tasksCount={tasksCount} />
      <div className="dashboard-actions">
        {showAddWord && onAddWord ? <AddWordBtn onClick={onAddWord} /> : null}
        <Link to={routes.training}>Train oneself</Link>
      </div>
    </section>
  );
}
