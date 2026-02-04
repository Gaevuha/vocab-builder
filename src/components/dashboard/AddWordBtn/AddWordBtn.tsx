export type AddWordBtnProps = {
  onClick: () => void;
};

export function AddWordBtn({ onClick }: AddWordBtnProps) {
  return (
    <button className="add-word-btn" type="button" onClick={onClick}>
      Add word
    </button>
  );
}
