import styles from "./AddWordBtn.module.css";

export type AddWordBtnProps = {
  onClick: () => void;
};

export function AddWordBtn({ onClick }: AddWordBtnProps) {
  return (
    <button className={styles.addWordBtn} type="button" onClick={onClick}>
      Add word
      <svg className={styles.addWordIcon}>
        <use xlinkHref="/icons/sprite.svg#icon-plus" />
      </svg>
    </button>
  );
}
