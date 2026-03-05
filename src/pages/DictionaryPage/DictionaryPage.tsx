import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { loadCategories } from "../../store/slices/categoriesSlice";
import { setWords, setPage } from "../../store/slices/wordsSlice";
import { showNotification } from "../../store/slices/uiSlice";

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

import type { Word, Statistics, CreateWordPayload } from "../../types/words";
import type { EditWordFormValues } from "../../components/forms/EditWordForm/EditWordForm";

import styles from "./DictionaryPage.module.css";

export function DictionaryPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const {
    items: words,
    totalPages,
    page,
    perPage,
  } = useAppSelector((state) => state.words);

  // ---------------- STATE ----------------

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVerbType, setSelectedVerbType] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editWord, setEditWord] = useState<Word | null>(null);

  const [statistics, setStatistics] = useState<Statistics>({
    totalCount: 0,
  });

  const [tasksCount, setTasksCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);
  const emptyNotificationShownRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(loadCategories());
  }, [dispatch, isAuthenticated]);

  // open modal via query
  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setShowAddModal(true);
      searchParams.delete("add");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // get error message helper
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const refreshTasksCount = useCallback(async () => {
    const tasks = await fetchTrainingTasks();
    setTasksCount(tasks.length);
  }, []);

  // ---------------- LOAD WORDS ----------------

  const loadWords = useCallback(
    async (currentPage: number) => {
      if (!isAuthenticated) return;

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

        // cancel outdated response
        if (requestId !== requestIdRef.current) return;

        const hasActiveFilters = Boolean(
          searchQuery.trim() || selectedCategory || selectedVerbType
        );

        if (
          data.items.length === 0 &&
          hasActiveFilters &&
          !emptyNotificationShownRef.current
        ) {
          dispatch(
            showNotification({
              message: "No words yet",
              type: "info",
            })
          );
          emptyNotificationShownRef.current = true;
        }

        if (data.items.length > 0 || !hasActiveFilters) {
          emptyNotificationShownRef.current = false;
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
    [
      isAuthenticated,
      dispatch,
      searchQuery,
      selectedCategory,
      selectedVerbType,
      perPage,
    ]
  );

  useEffect(() => {
    dispatch(setPage(1));
    loadWords(1);
  }, [dispatch, loadWords]);

  // ---------------- STATS ----------------

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadStats = async () => {
      try {
        const stats = await fetchStatistics();

        setStatistics(stats);
        await refreshTasksCount();
      } catch {
        dispatch(
          showNotification({
            message: "Failed to load statistics",
            type: "error",
          })
        );
      }
    };

    loadStats();
  }, [dispatch, isAuthenticated, refreshTasksCount]);

  // ---------------- ACTIONS ----------------

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

  const handleAddWord = async (values: CreateWordPayload) => {
    await addWord(values);
    dispatch(setPage(1));
    await loadWords(1);
    await refreshTasksCount();
  };

  const handleEditWord = async (values: EditWordFormValues) => {
    if (!editWord) return;

    await updateWord(editWord.id, {
      en: values.en,
      ua: values.ua,
      category: editWord.category,
      isIrregular: editWord.isIrregular,
    });

    setEditWord(null);
    await loadWords(page);
    await refreshTasksCount();
  };

  const handleDeleteWord = async (word: Word) => {
    await deleteWord(word.id);

    dispatch(
      showNotification({
        message: "Word deleted successfully",
        type: "success",
      })
    );

    await loadWords(page);
    await refreshTasksCount();
  };

  // ---------------- UI ----------------

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
          onPageChange={(nextPage) => {
            dispatch(setPage(nextPage));
            loadWords(nextPage);
          }}
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
