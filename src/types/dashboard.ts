export type DashboardProps = {
  showAddWord?: boolean;
  onAddWord?: () => void;
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVerbTypeChange?: (value: string) => void;
  totalWords: number;
  tasksCount: number;
};
