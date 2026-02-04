import { Modal } from "../../common/ModalWrapper/ModalWrapper";
import { AddWordForm } from "../../forms/AddWordForm/AddWordForm";
import type { AddWordFormValues } from "../../forms/AddWordForm/AddWordForm";
import type { CreateWordPayload } from "../../../types/words";

export type AddWordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateWordPayload) => void | Promise<void>;
  isLoading?: boolean;
};

export function AddWordModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddWordModalProps) {
  function handleSubmit(values: AddWordFormValues) {
    const payload: CreateWordPayload = {
      en: values.en,
      ua: values.ua,
      category: values.category,
      isIrregular:
        values.category === "verb"
          ? values.verbType === "irregular"
          : undefined,
    };

    return onSubmit(payload);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Modal title="Add word" onClose={onClose}>
      <AddWordForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
