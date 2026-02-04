import { useMemo, useState, type MouseEvent } from "react";
import type { Word } from "../../../types/words";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export type WordsTableProps = {
  words: Word[];
  withActions?: boolean;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
  onAddToDictionary?: (word: Word) => void;
};

export function WordsTable({
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
              <button
                type="button"
                onClick={() => onAddToDictionary?.(word)}
              >
                Add to dictionary
              </button>
            );
          }

          return (
            <RowActions
              word={word}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        },
      },
    ],
    [onAddToDictionary, onDelete, onEdit, withActions]
  );

  const table = useReactTable({
    data: words,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="words-table">
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
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
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

type RowActionsProps = {
  word: Word;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
};

function RowActions({ word, onEdit, onDelete }: RowActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleEdit = () => {
    onEdit?.(word);
    handleClose();
  };

  const handleDelete = () => {
    onDelete?.(word);
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="Actions"
        onClick={handleOpen}
        size="small"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}
