// src/components/common/WordsTable/WordsTable.tsx
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import type { WordsTableProps } from "../../../types/words";
import { WordsTableDesktop } from "./WordsTableDesktop";
import { WordsTableTablet } from "./WordsTableTablet";
import { WordsTableMobile } from "./WordsTableMobile";

export function WordsTable(props: WordsTableProps) {
  const { isDesktop, isTablet } = useBreakpoint();

  if (isDesktop) return <WordsTableDesktop {...props} />;
  if (isTablet) return <WordsTableTablet {...props} />;
  return <WordsTableMobile {...props} />;
}
