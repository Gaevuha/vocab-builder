import { useEffect } from "react";
import type { PropsWithChildren } from "react";
export type ModalProps = PropsWithChildren<{
  title?: string;
  onClose: () => void;
}>;

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" type="button" onClick={onClose}>
          ✕
        </button>
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}
