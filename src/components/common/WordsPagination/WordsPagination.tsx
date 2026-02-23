import { useMemo } from "react";
import type { WordsPaginationProps } from "../../../types/words";
import styles from "./WordsPagination.module.css";

export function WordsPagination({
  page,
  totalPages,
  onPageChange,
  className = "",
}: WordsPaginationProps) {
  const safeTotalPages = Number(totalPages) || 0;

  const pages = useMemo(() => {
    if (safeTotalPages <= 1) return [];

    const result: (number | string)[] = [1];

    if (safeTotalPages >= 2) {
      result.push(2);
    }

    if (safeTotalPages > 2) {
      if (page > 2 && page < safeTotalPages) {
        result.push("…", page, "…");
      } else {
        result.push("…");
      }
      result.push(safeTotalPages);
    }

    return result;
  }, [page, safeTotalPages]);

  if (safeTotalPages <= 1) return null;

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(safeTotalPages, Math.max(1, nextPage));
    if (clamped !== page) {
      onPageChange(clamped);
    }
  };

  return (
    <div className={`${styles.pagination} ${className}`.trim()}>
      <button
        type="button"
        className={styles.navButton}
        disabled={page === 1}
        onClick={() => goToPage(1)}
        aria-label="First page"
      >
        «
      </button>
      <button
        type="button"
        className={styles.navButton}
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      <ul className={styles.pageList}>
        {pages.map((p, idx) => (
          <li
            key={typeof p === "number" ? `page-${p}` : `dots-${idx}`}
            className={typeof p === "string" ? styles.dots : undefined}
          >
            {typeof p === "number" ? (
              <button
                type="button"
                className={`${styles.pageButton} ${
                  p === page ? styles.pageButtonActive : ""
                }`.trim()}
                onClick={() => goToPage(p)}
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
        className={styles.navButton}
        disabled={page === safeTotalPages}
        onClick={() => goToPage(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
      <button
        type="button"
        className={styles.navButton}
        disabled={page === safeTotalPages}
        onClick={() => goToPage(safeTotalPages)}
        aria-label="Last page"
      >
        »
      </button>
    </div>
  );
}
