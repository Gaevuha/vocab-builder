export type WordsPaginationProps = {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
};

export function WordsPagination({
  page,
  total,
  perPage,
  onPageChange,
}: WordsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
