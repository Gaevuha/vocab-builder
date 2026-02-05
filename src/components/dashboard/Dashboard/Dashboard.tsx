import { useBreakpoint } from "../../../hooks/useBreakpoint";
import type { DashboardProps } from "../../../types/dashboard";
import { DashboardDesktop } from "./DashboardDesktop";
import { DashboardMobile } from "./DashboardMobile";

export function Dashboard({
  showAddWord = true,
  onAddWord,
  onSearch,
  onCategoryChange,
  onVerbTypeChange,
  totalWords,
  tasksCount,
}: DashboardProps) {
  const { isDesktop } = useBreakpoint();
  const Component = isDesktop ? DashboardDesktop : DashboardMobile;

  return (
    <Component
      showAddWord={showAddWord}
      onAddWord={onAddWord}
      onSearch={onSearch}
      onCategoryChange={onCategoryChange}
      onVerbTypeChange={onVerbTypeChange}
      totalWords={totalWords}
      tasksCount={tasksCount}
    />
  );
}
