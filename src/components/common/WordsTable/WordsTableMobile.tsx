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
import styles from "./WordsTableMobile.module.css";

export function WordsTableMobile({
  words,
  withActions = true,
  onEdit,
  onDelete,
  onAddToDictionary,
  tableMode = "dictionary",
}: WordsTableProps) {
  const columns = useMemo<ColumnDef<Word>[]>(
    () => [
      {
        header: "Word",
        accessorKey: "en",
        cell: (info) => info.getValue<string>(),
      },
      {
        header: "Translation",
        accessorKey: "ua",
        cell: (info) => info.getValue<string>(),
      },
      ...(tableMode === "recommend"
        ? [
            { header: "Category", accessorKey: "category" },
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
          ]
        : [
            {
              header: "Progress",
              accessorKey: "progress",
              cell: ({ row }: { row: Row<Word> }) => (
                <div className={styles.progressCell}>
                  <ProgressBar
                    value={row.original.progress}
                    max={100}
                    size={24}
                  />
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
          ]),
    ],
    [onAddToDictionary, onDelete, onEdit, tableMode, withActions]
  );

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
                <col style={{ width: "90px" }} />
                <col style={{ width: "116px" }} />
                <col style={{ width: "99px" }} />
                <col style={{ width: "38px" }} />
              </>
            ) : (
              <>
                <col style={{ width: "82px" }} />
                <col style={{ width: "116px" }} />
                <col style={{ width: "95px" }} />
                <col style={{ width: "50px" }} />
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
