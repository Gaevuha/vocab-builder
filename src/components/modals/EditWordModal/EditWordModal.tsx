import { useState } from "react";
import { ModalWrapper } from "../../common/ModalWrapper/ModalWrapper";
import { EditWordForm } from "../../forms/EditWordForm/EditWordForm";
import type { EditWordFormValues } from "../../forms/EditWordForm/EditWordForm";
import type { Word } from "../../../types/words";
import { useAppDispatch } from "../../../store/hooks";
import { showNotification } from "../../../store/slices/uiSlice";

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
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const handleSubmit = async (values: EditWordFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      dispatch(
        showNotification({
          message: "Word updated successfully",
          type: "success",
        })
      );
      onClose();
    } catch (error) {
      dispatch(
        showNotification({
          message: getErrorMessage(error, "Failed to update word"),
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !word) {
    return null;
  }

  return (
    <ModalWrapper onClose={onClose}>
      <EditWordForm
        word={word}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading || isSubmitting}
      />
    </ModalWrapper>
  );
}
