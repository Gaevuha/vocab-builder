import type { Word } from "../../../types/words";
import { ProgressBar } from "../ProgressBar/ProgressBar";

export type WordsTableProps = {
  words: Word[];
  withActions?: boolean;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
  onAddToDictionary?: (word: Word) => void;
};

export function WordsTable({
  words,
  withActions = true,
  onEdit,
  onDelete,
  onAddToDictionary,
}: WordsTableProps) {
  return (
    <div className="words-table">
      <table>
        <thead>
          <tr>
            <th>EN</th>
            <th>UA</th>
            <th>Category</th>
            <th>Progress</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.id}>
              <td>{word.en}</td>
              <td>{word.ua}</td>
              <td>{word.category}</td>
              <td>
                <ProgressBar value={word.progress} max={100} />
              </td>
              <td>
                {withActions ? (
                  <div className="table-actions">
                    <button type="button" onClick={() => onEdit?.(word)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete?.(word)}>
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddToDictionary?.(word)}
                  >
                    Add to dictionary
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
