import { Link } from "react-router-dom";
import { routes } from "../../../app/routes";
import { Filters } from "../Filters/Filters";
import { Statistics } from "../Statistics/Statistics";
import { AddWordBtn } from "../AddWordBtn/AddWordBtn";

export type DashboardProps = {
  showAddWord?: boolean;
  onAddWord?: () => void;
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVerbTypeChange?: (value: string) => void;
  totalWords: number;
  tasksCount: number;
};

export function Dashboard({
  showAddWord = true,
  onAddWord,
  onSearch,
  onCategoryChange,
  onVerbTypeChange,
  totalWords,
  tasksCount,
}: DashboardProps) {
  return (
    <section className="dashboard">
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
