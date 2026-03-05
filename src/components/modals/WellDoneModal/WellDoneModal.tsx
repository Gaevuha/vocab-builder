import { ModalWrapper } from "../../common/ModalWrapper/ModalWrapper";
import styles from "./WellDoneModal.module.css";

export type WellDoneModalProps = {
  isOpen: boolean;
  correctAnswers: string[];
  mistakes: string[];
  onClose: () => void;
};

export function WellDoneModal({
  isOpen,
  correctAnswers,
  mistakes,
  onClose,
}: WellDoneModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper onClose={onClose} className={styles.modalWellDone}>
      <div className={styles.wellDoneModal}>
        <h2 className={styles.title}>Well done</h2>

        <div className={styles.resultsGrid}>
          <div className={styles.column}>
            <p className={styles.columnTitle}>Correct answers:</p>
            <ul className={styles.list}>
              {correctAnswers.map((word, index) => (
                <li
                  key={`correct-${word}-${index}`}
                  className={styles.listItem}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.column} ${styles.mistakesColumn}`}>
            <p className={styles.columnTitle}>Mistakes:</p>
            <ul className={styles.list}>
              {mistakes.map((word, index) => (
                <li
                  key={`mistake-${word}-${index}`}
                  className={styles.listItem}
                >
                  {word}
                </li>
              ))}
            </ul>

            <div className={styles.imgWrapperWellDone}>
              <picture>
                <source
                  srcSet="/img/open-book-tablet.webp 1x, /img/open-book-tablet@2x.webp 2x"
                  media="(min-width: 768px)"
                />
                <img
                  src="/img/open-book-mobile.webp"
                  srcSet="/img/open-book-mobile.webp 1x, /img/open-book-mobile@2x.webp 2x"
                  alt="Illustration"
                  className={styles.imgMobileMenu}
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
