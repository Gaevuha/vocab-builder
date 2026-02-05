import { useBreakpoint } from "../../../hooks/useBreakpoint";
import type { WordsTableProps } from "../../../types/words";
import { WordsTableDesktop } from "./WordsTableDesktop";
import { WordsTableMobile } from "./WordsTableMobile";

export function WordsTable({
  words,
  withActions = true,
  onEdit,
  onDelete,
  onAddToDictionary,
}: WordsTableProps) {
  const { isDesktop } = useBreakpoint();
  const Component = isDesktop ? WordsTableDesktop : WordsTableMobile;

  return (
    <Component
      words={words}
      withActions={withActions}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddToDictionary={onAddToDictionary}
    />
  );
}
