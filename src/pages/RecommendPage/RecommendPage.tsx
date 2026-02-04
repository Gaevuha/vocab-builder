import { Dashboard } from "../../components/dashboard/Dashboard/Dashboard";
import { WordsTable } from "../../components/common/WordsTable/WordsTable";
import { WordsPagination } from "../../components/common/WordsPagination/WordsPagination";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPage } from "../../store/slices/wordsSlice";
import { showNotification } from "../../store/slices/uiSlice";
import type { Word } from "../../types/words";

export function RecommendPage() {
  const dispatch = useAppDispatch();
  const wordsState = useAppSelector((state) => state.words);

  function handleAddToDictionary(word: Word) {
    dispatch(
      showNotification({
        message: `Add ${word.en} to dictionary`,
        type: "info",
      })
    );
  }

  return (
    <section className="page">
      <h1>Recommend</h1>
      <Dashboard
        showAddWord={false}
        onSearch={() => undefined}
        onCategoryChange={() => undefined}
        onVerbTypeChange={() => undefined}
        totalWords={wordsState.total}
        tasksCount={0}
      />
      <WordsTable
        words={wordsState.items}
        withActions={false}
        onAddToDictionary={handleAddToDictionary}
      />
      <WordsPagination
        page={wordsState.page}
        total={wordsState.total}
        perPage={wordsState.perPage}
        onPageChange={(page) => dispatch(setPage(page))}
      />
    </section>
  );
}
