import { useMemo } from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Word, WordsTableProps } from "../../../types/words";

import { RowActions } from "./WordsTableActions";

export function WordsTableDesktop({
  words,
  withActions = true,
  onEdit,
  onDelete,
  onAddToDictionary,
}: WordsTableProps) {
  const columns = useMemo<ColumnDef<Word>[]>(
    () => [
      {
        header: "EN",
        accessorKey: "en",
        cell: (info) => info.getValue<string>(),
      },
      {
        header: "UA",
        accessorKey: "ua",
        cell: (info) => info.getValue<string>(),
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: (info) => info.getValue<string>(),
      },
      {
        header: "Progress",
        accessorKey: "progress",
        cell: ({ row }) => (
          <ProgressBar value={row.original.progress} max={100} />
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const word = row.original;

          if (!withActions) {
            return (
              <button type="button" onClick={() => onAddToDictionary?.(word)}>
                Add to dictionary
              </button>
            );
          }

          return <RowActions word={word} onEdit={onEdit} onDelete={onDelete} />;
        },
      },
    ],
    [onAddToDictionary, onDelete, onEdit, withActions]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: words,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="words-table words-table--desktop">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No words found</td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
