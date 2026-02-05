import type { WordsTableProps } from "../../../types/words";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { RowActions } from "./WordsTableActions";

export function WordsTableMobile({
  words,
  withActions = true,
  onEdit,
  onDelete,
  onAddToDictionary,
}: WordsTableProps) {
  return (
    <div className="words-table words-table--mobile">
      {words.length === 0 ? (
        <div className="words-list__empty">No words found</div>
      ) : (
        <ul className="words-list">
          {words.map((word) => (
            <li key={word.id} className="words-card">
              <div className="words-card__row">
                <span className="words-card__label">EN</span>
                <strong className="words-card__value">{word.en}</strong>
              </div>
              <div className="words-card__row">
                <span className="words-card__label">UA</span>
                <strong className="words-card__value">{word.ua}</strong>
              </div>
              <div className="words-card__row">
                <span className="words-card__label">Category</span>
                <span className="words-card__value">{word.category}</span>
              </div>
              <div className="words-card__row">
                <span className="words-card__label">Progress</span>
                <ProgressBar value={word.progress} max={100} />
              </div>
              <div className="words-card__actions">
                {!withActions ? (
                  <button
                    type="button"
                    onClick={() => onAddToDictionary?.(word)}
                  >
                    Add to dictionary
                  </button>
                ) : (
                  <RowActions word={word} onEdit={onEdit} onDelete={onDelete} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
