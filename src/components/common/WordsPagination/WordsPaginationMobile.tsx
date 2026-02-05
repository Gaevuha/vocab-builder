import type { WordsPaginationProps } from "../../../types/words";

export function WordsPaginationMobile({
  page,
  total,
  perPage,
  onPageChange,
  className = "",
}: WordsPaginationProps) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className={`pagination pagination--mobile ${className}`}>
      <button
        type="button"
        className="pagination__prev"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>
      <span className="pagination__status">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="pagination__next"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
