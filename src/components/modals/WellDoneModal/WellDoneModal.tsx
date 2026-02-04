import { Modal } from "../../common/ModalWrapper/ModalWrapper";

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
    <Modal title="Well done!" onClose={onClose}>
      <p>Your score: {score}</p>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
}
