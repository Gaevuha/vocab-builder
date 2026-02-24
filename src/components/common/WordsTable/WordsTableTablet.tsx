import { useMemo } from "react";
import type { Row } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Word, WordsTableProps } from "../../../types/words";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { RowActions } from "./WordsTableActions";
import styles from "./WordsTableTablet.module.css";

export function WordsTableTablet({
  words,
  withActions = true,
  onEdit,
  onDelete,
  onAddToDictionary,
  tableMode = "dictionary",
}: WordsTableProps) {
  const columns = useMemo<ColumnDef<Word>[]>(() => {
    const baseColumns: ColumnDef<Word>[] = [
      {
        header: () => (
          <div className={styles.headerWithIcon}>
            <span>Word</span>
            <svg className={styles.headerIcon}>
              <use href="/icons/sprite.svg#icon-united-kingdom" />
            </svg>
          </div>
        ),
        accessorKey: "en",
        cell: ({ row }: { row: Row<Word> }) =>
          tableMode === "recommend" ? (
            <span>{row.original.en}</span>
          ) : (
            row.original.en
          ),
      },
      {
        header: () => (
          <div className={styles.headerWithIcon}>
            <span>Translation</span>
            <svg className={styles.headerIcon}>
              <use href="/icons/sprite.svg#icon-ukraine" />
            </svg>
          </div>
        ),
        accessorKey: "ua",
        cell: ({ row }: { row: Row<Word> }) =>
          tableMode === "recommend" ? (
            <span>{row.original.ua}</span>
          ) : (
            row.original.ua
          ),
      },
    ];

    if (tableMode === "recommend") {
      return [
        ...baseColumns,
        { header: "Category", accessorKey: "category" },
        {
          id: "actions",
          header: "",
          cell: ({ row }: { row: Row<Word> }) => {
            const word = row.original;
            return (
              <button
                type="button"
                className={styles.buttonAdd}
                onClick={() => onAddToDictionary?.(word)}
              >
                <span className={styles.textBtn}>Add to dictionary</span>
                <svg className={styles.iconAdd}>
                  <use href="/icons/sprite.svg#icon-arrow-right" />
                </svg>
              </button>
            );
          },
        },
      ];
    } else {
      return [
        ...baseColumns,
        { header: "Category", accessorKey: "category" },
        {
          header: "Progress",
          accessorKey: "progress",
          cell: ({ row }: { row: Row<Word> }) => (
            <div className={styles.wrapperProgress}>
              <span className={styles.textProgress}>
                {row.original.progress}%
              </span>
              <ProgressBar value={row.original.progress} max={100} size={28} />
            </div>
          ),
        },
        {
          id: "actions",
          header: "",
          cell: ({ row }: { row: Row<Word> }) => {
            const word = row.original;
            if (!withActions) {
              return (
                <button
                  type="button"
                  className={styles.buttonAdd}
                  onClick={() => onAddToDictionary?.(word)}
                >
                  Add to dictionary
                </button>
              );
            }
            return (
              <RowActions word={word} onEdit={onEdit} onDelete={onDelete} />
            );
          },
        },
      ];
    }
  }, [onAddToDictionary, onDelete, onEdit, tableMode, withActions]);

  const table = useReactTable({
    data: words,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.tableWrapper}>
      {words.length === 0 ? (
        <div className={styles.emptyBlock}>No words found!</div>
      ) : (
        <table className={styles.table}>
          <colgroup>
            {tableMode === "recommend" ? (
              <>
                <col style={{ width: "180px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "148px" }} />
              </>
            ) : (
              <>
                <col style={{ width: "160px" }} />
                <col style={{ width: "169px" }} />
                <col style={{ width: "151px" }} />
                <col style={{ width: "122px" }} />
                <col style={{ width: "66px" }} />
              </>
            )}
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={`${styles.th} ${
                      idx !== headerGroup.headers.length - 1
                        ? styles.thWithBorder
                        : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    key={cell.id}
                    className={`${styles.td} ${
                      idx !== row.getVisibleCells().length - 1
                        ? styles.tdWithBorder
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
