import { useState } from "react";
import { Dashboard } from "../../components/dashboard/Dashboard/Dashboard";
import { WordsTable } from "../../components/common/WordsTable/WordsTable";
import { WordsPagination } from "../../components/common/WordsPagination/WordsPagination";
import { AddWordModal } from "../../components/modals/AddWordModal/AddWordModal";
import { EditWordModal } from "../../components/modals/EditWordModal/EditWordModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPage } from "../../store/slices/wordsSlice";
import type { Word } from "../../types/words";
import { showNotification } from "../../store/slices/uiSlice";

export function DictionaryPage() {
  const dispatch = useAppDispatch();
  const wordsState = useAppSelector((state) => state.words);
  const [addOpen, setAddOpen] = useState(false);
  const [editWord, setEditWord] = useState<Word | null>(null);

  function handleAddWord() {
    setAddOpen(true);
  }

  function handleEditWord(word: Word) {
    setEditWord(word);
  }

  function handleDeleteWord() {
    dispatch(
      showNotification({ message: "Delete flow not wired yet", type: "info" })
    );
  }

  return (
    <section className="page">
      <h1>Dictionary</h1>
      <Dashboard
        showAddWord
        onAddWord={handleAddWord}
        onSearch={() => undefined}
        onCategoryChange={() => undefined}
        onVerbTypeChange={() => undefined}
        totalWords={wordsState.total}
        tasksCount={0}
      />
      <WordsTable
        words={wordsState.items}
        withActions
        onEdit={handleEditWord}
        onDelete={handleDeleteWord}
      />
      <WordsPagination
        page={wordsState.page}
        total={wordsState.total}
        perPage={wordsState.perPage}
        onPageChange={(page) => dispatch(setPage(page))}
      />

      <AddWordModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={() => setAddOpen(false)}
      />
      <EditWordModal
        isOpen={Boolean(editWord)}
        word={editWord}
        onClose={() => setEditWord(null)}
        onSubmit={() => setEditWord(null)}
      />
    </section>
  );
}
