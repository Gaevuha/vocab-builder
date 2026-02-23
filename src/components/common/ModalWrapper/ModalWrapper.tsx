import { useEffect, useRef, useCallback, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalWrapper.module.css";

type ModalWrapperProps = PropsWithChildren<{
  onClose: () => void;
}>;

export function ModalWrapper({ onClose, children }: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement;

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );

    focusable?.[0]?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }

    window.addEventListener("keydown", handleTab);
    window.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleTab);
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      lastFocusedElement.current?.focus();
    };
  }, [handleClose]);

  return createPortal(
    <div className={styles.backdrop} onClick={handleClose} role="presentation">
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className={styles.close}
          type="button"
          aria-label="Close modal"
          onClick={handleClose}
        >
          <svg className={styles.iconClose} aria-hidden="true">
            <use xlinkHref="/icons/sprite.svg#icon-x"></use>
          </svg>
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
