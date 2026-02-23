import { ModalWrapper } from "../../common/ModalWrapper/ModalWrapper";

export type WellDoneModalProps = {
  isOpen: boolean;
  score: number;
  onClose: () => void;
};

export function WellDoneModal({ isOpen, score, onClose }: WellDoneModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper onClose={onClose}>
      <p>Your score: {score ?? 0}</p>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </ModalWrapper>
  );
}
