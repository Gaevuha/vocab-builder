import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
import styles from "./DictionaryPage.module.css";

export function DictionaryPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    items: words,
    totalPages,
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
  const requestIdRef = useRef(0);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setShowAddModal(true);
      searchParams.delete("add");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const loadWords = useCallback(
    async (currentPage: number) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      try {
        setLoading(true);
        const data = await fetchOwnWords({
          keyword: searchQuery || undefined,
          category: selectedCategory || undefined,
          isIrregular:
            selectedCategory === "verb"
              ? selectedVerbType === "irregular"
              : undefined,
          page: currentPage,
          limit: perPage,
        });
        if (requestId !== requestIdRef.current) {
          return;
        }
        dispatch(
          setWords({
            items: data.items,
            totalPages: data.totalPages,
            perPage: data.perPage,
          })
        );
      } catch (error) {
        dispatch(
          showNotification({
            message: getErrorMessage(error, "Failed to load words"),
            type: "error",
          })
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [dispatch, perPage, searchQuery, selectedCategory, selectedVerbType]
  );

  useEffect(() => {
    dispatch(setPage(1));
    loadWords(1);
  }, [dispatch, loadWords]);

  useEffect(() => {
    const loadInitialData = async () => {
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
    };

    loadInitialData();
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedVerbType("");
  };

  const handleVerbTypeChange = (value: string) => {
    setSelectedVerbType(value);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    loadWords(newPage);
  };

  const handleAddWord = async (values: CreateWordPayload) => {
    await addWord(values);
    loadWords(page);
  };

  const handleEditWord = async (values: EditWordFormValues) => {
    if (!editWord) return;
    await updateWord(editWord.id, {
      en: values.en,
      ua: values.ua,
      category: editWord.category,
      isIrregular: editWord.isIrregular,
    });
    await loadWords(page);
  };

  const handleDeleteWord = async (word: Word) => {
    try {
      await deleteWord(word.id);
      loadWords(page);
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

  return (
    <section className={styles.dictionaryPage}>
      <div className="container">
        <Dashboard
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onVerbTypeChange={handleVerbTypeChange}
          onAddWord={() => setShowAddModal(true)}
          totalWords={statistics.totalCount}
          tasksCount={tasksCount}
        />

        {loading && words.length === 0 && <p>Loading...</p>}

        <WordsTable
          words={words}
          onEdit={setEditWord}
          onDelete={handleDeleteWord}
        />

        <WordsPagination
          page={page}
          totalPages={totalPages}
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
    </section>
  );
}
