import { useBreakpoint } from "../../../hooks/useBreakpoint";
import type { WordsPaginationProps } from "../../../types/words";
import { WordsPaginationDesktop } from "./WordsPaginationDesktop";
import { WordsPaginationMobile } from "./WordsPaginationMobile";

export function WordsPagination({
  page,
  total,
  perPage,
  onPageChange,
  className = "",
}: WordsPaginationProps) {
  const { isDesktop } = useBreakpoint();
  const Component = isDesktop ? WordsPaginationDesktop : WordsPaginationMobile;

  return (
    <Component
      page={page}
      total={total}
      perPage={perPage}
      onPageChange={onPageChange}
      className={className}
    />
  );
}
