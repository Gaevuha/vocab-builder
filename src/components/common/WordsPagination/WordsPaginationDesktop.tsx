import { useMemo } from "react";
import type { WordsPaginationProps } from "../../../types/words";

export function WordsPaginationDesktop({
  page,
  total,
  perPage,
  onPageChange,
  className = "",
}: WordsPaginationProps) {
  const totalPages = Math.ceil(total / perPage);

  const pages = useMemo(() => {
    if (totalPages <= 1) return [];

    const result: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);

      if (page <= 3) {
        result.push(2);
        result.push(3);
        result.push("…");
      } else if (page >= totalPages - 2) {
        result.push("…");
        result.push(totalPages - 2);
        result.push(totalPages - 1);
      } else {
        result.push("…");
        result.push(page);
        result.push("…");
      }

      result.push(totalPages);
    }

    return result;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className={`pagination pagination--desktop ${className}`}>
      <button
        type="button"
        className="pagination__prev"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>

      <ul className="pagination__list">
        {pages.map((p, idx) => (
          <li
            key={typeof p === "number" ? `page-${p}` : `dots-${idx}`}
            className={typeof p === "string" ? "pagination__dots" : ""}
          >
            {typeof p === "number" ? (
              <button
                type="button"
                className={`pagination__page ${
                  p === page ? "pagination__page--active" : ""
                }`}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ) : (
              <span aria-hidden="true">{p}</span>
            )}
          </li>
        ))}
      </ul>

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
