import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadCategories } from "../../store/slices/categoriesSlice";
import { setWords, setPage } from "../../store/slices/wordsSlice";
import { showNotification } from "../../store/slices/uiSlice";

import type { Word, Statistics, CreateWordPayload } from "../../types/words";
import type { EditWordFormValues } from "../../components/forms/EditWordForm/EditWordForm";
import {
  addWord,
  deleteWord,
  fetchOwnWords,
  fetchStatistics,
  updateWord,
} from "../../services/words";
import { fetchTrainingTasks } from "../../services/training";

import { Dashboard } from "../../components/dashboard/Dashboard/Dashboard";
import { WordsTable } from "../../components/common/WordsTable/WordsTable";
import { WordsPagination } from "../../components/common/WordsPagination/WordsPagination";
import { AddWordModal } from "../../components/modals/AddWordModal/AddWordModal";
import { EditWordModal } from "../../components/modals/EditWordModal/EditWordModal";

export function DictionaryPage() {
  const dispatch = useAppDispatch();

  const {
    items: words,
    total,
    page,
    perPage,
  } = useAppSelector((state) => state.words);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVerbType, setSelectedVerbType] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editWord, setEditWord] = useState<Word | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalCount: 0,
  });
  const [tasksCount, setTasksCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  /* =======================
     Load categories
  ======================= */

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  /* =======================
     Load words
  ======================= */

  const loadWords = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchOwnWords({
        keyword: searchQuery || undefined,
        category: selectedCategory || undefined,
        isIrregular:
          selectedCategory === "verb"
            ? selectedVerbType === "irregular"
            : undefined,
        page,
        limit: perPage,
      });

      dispatch(setWords({ items: data.items, total: data.total }));
    } catch (error) {
      dispatch(
        showNotification({
          message: getErrorMessage(error, "Failed to load words"),
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    page,
    perPage,
    searchQuery,
    selectedCategory,
    selectedVerbType,
  ]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  /* =======================
     Load statistics
  ======================= */

  useEffect(() => {
    (async () => {
      try {
        const stats = await fetchStatistics();
        setStatistics(stats);
        const tasks = await fetchTrainingTasks();
        setTasksCount(tasks.length);
      } catch (error) {
        dispatch(
          showNotification({
            message: getErrorMessage(error, "Failed to load statistics"),
            type: "error",
          })
        );
      }
    })();
  }, [dispatch]);

  /* =======================
     Handlers
  ======================= */

  const handleSearch = (value: string) => {
    dispatch(setPage(1));
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setPage(1));
    setSelectedCategory(value);
    setSelectedVerbType("");
  };

  const handleVerbTypeChange = (value: string) => {
    dispatch(setPage(1));
    setSelectedVerbType(value);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleAddWord = async (values: CreateWordPayload) => {
    try {
      await addWord(values);
      setShowAddModal(false);
      loadWords();
      dispatch(
        showNotification({
          message: "Word added successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: getErrorMessage(error, "Failed to add word"),
          type: "error",
        })
      );
    }
  };

  const handleEditWord = async (values: EditWordFormValues) => {
    if (!editWord) return;

    try {
      await updateWord(editWord.id, {
        en: values.en,
        ua: values.ua,
      });
      setEditWord(null);
      loadWords();
      dispatch(
        showNotification({
          message: "Word updated successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: getErrorMessage(error, "Failed to update word"),
          type: "error",
        })
      );
    }
  };

  const handleDeleteWord = async (word: Word) => {
    try {
      await deleteWord(word.id);
      loadWords();
      dispatch(
        showNotification({
          message: "Word deleted successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: getErrorMessage(error, "Failed to delete word"),
          type: "error",
        })
      );
    }
  };

  /* =======================
     Render
  ======================= */

  return (
    <div className="dictionary-page">
      <Dashboard
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onVerbTypeChange={handleVerbTypeChange}
        onAddWord={() => setShowAddModal(true)}
        totalWords={statistics.totalCount}
        tasksCount={tasksCount}
      />

      {loading && <p>Loading...</p>}

      <WordsTable
        words={words}
        onEdit={setEditWord}
        onDelete={handleDeleteWord}
      />

      <WordsPagination
        page={page}
        total={total}
        perPage={perPage}
        onPageChange={handlePageChange}
      />

      <AddWordModal
        isOpen={showAddModal}
        onSubmit={handleAddWord}
        onClose={() => setShowAddModal(false)}
      />

      <EditWordModal
        isOpen={Boolean(editWord)}
        word={editWord}
        onSubmit={handleEditWord}
        onClose={() => setEditWord(null)}
      />
    </div>
  );
}
