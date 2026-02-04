import { Modal } from "../../common/ModalWrapper/ModalWrapper";
import { AddWordForm } from "../../forms/AddWordForm/AddWordForm";
import type { AddWordFormValues } from "../../forms/AddWordForm/AddWordForm";
export type AddWordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddWordFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

export function AddWordModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddWordModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal title="Add word" onClose={onClose}>
      <AddWordForm
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
