import { Modal } from "../../common/ModalWrapper/ModalWrapper";
import { EditWordForm } from "../../forms/EditWordForm/EditWordForm";
import type { EditWordFormValues } from "../../forms/EditWordForm/EditWordForm";
import type { Word } from "../../../types/words";

export type EditWordModalProps = {
  isOpen: boolean;
  word: Word | null;
  onClose: () => void;
  onSubmit: (values: EditWordFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

export function EditWordModal({
  isOpen,
  word,
  onClose,
  onSubmit,
  isLoading = false,
}: EditWordModalProps) {
  if (!isOpen || !word) {
    return null;
  }

  return (
    <Modal title="Edit word" onClose={onClose}>
      <EditWordForm
        word={word}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
