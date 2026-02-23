import { useState } from "react";
import type { Word } from "../../../types/words";
import * as Popover from "@radix-ui/react-popover";
import styles from "./WordsTableActions.module.css";

export type RowActionsProps = {
  word: Word;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
};

export function RowActions({ word, onEdit, onDelete }: RowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    onEdit?.(word);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.(word);
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={styles.actionsButton}
          aria-label="Actions"
        >
          <svg className={styles.iconMore}>
            <use href="/icons/sprite.svg#icon-more-horizontal" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles.menu}
          side="bottom"
          align="end"
          sideOffset={6}
        >
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleEdit}
          >
            <svg className={styles.editIcon}>
              <use href="/icons/sprite.svg#icon-edit" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleDelete}
          >
            <svg className={styles.deleteIcon}>
              <use href="/icons/sprite.svg#icon-trash" />
            </svg>
            Delete
          </button>
          <Popover.Arrow className={styles.menuArrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
