import { useState } from "react";
import { ModalWrapper } from "../../common/ModalWrapper/ModalWrapper";
import { AddWordForm } from "../../forms/AddWordForm/AddWordForm";
import type { AddWordFormValues } from "../../forms/AddWordForm/AddWordForm";
import type { CreateWordPayload } from "../../../types/words";
import { useAppDispatch } from "../../../store/hooks";
import { showNotification } from "../../../store/slices/uiSlice";
import styles from "./AddWordModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateWordPayload) => void | Promise<void>;
};

export function AddWordModal({ isOpen, onClose, onSubmit }: Props) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (values: AddWordFormValues) => {
    const payload: CreateWordPayload = {
      en: values.en,
      ua: values.ua,
      category: values.category,
      isIrregular:
        values.category === "verb"
          ? values.verbType === "irregular"
          : undefined,
    };

    try {
      setIsSubmitting(true);
      await onSubmit(payload);
      dispatch(
        showNotification({
          message: "Word added successfully",
          type: "success",
        })
      );
      onClose();
    } catch {
      dispatch(
        showNotification({
          message: "Failed to add word",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className={styles.titleForm}>Add Word</h2>
      <p className={styles.description}>
        Adding a new word to the dictionary is an important step in enriching
        the language base and expanding the vocabulary.
      </p>

      <AddWordForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isSubmitting}
      />
    </ModalWrapper>
  );
}
