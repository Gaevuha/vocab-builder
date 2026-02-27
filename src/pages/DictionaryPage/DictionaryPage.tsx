import { useEffect, useState, useRef, useMemo } from "react";
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
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);
  const emptyNotificationShownRef = useRef(false);

  // ---------------- INIT ----------------

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

  // ---------------- LOAD WORDS ----------------

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadWords = async () => {
      const requestId = ++requestIdRef.current;

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

        // cancel outdated response
        if (requestId !== requestIdRef.current) return;

        dispatch(
          setWords({
            items: data.items,
            totalPages: data.totalPages,
            perPage: data.perPage,
          })
        );

        hasLoadedRef.current = true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load words";

        dispatch(
          showNotification({
            message,
            type: "error",
          })
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    loadWords();
  }, [
    isAuthenticated,
    dispatch,
    page,
    perPage,
    searchQuery,
    selectedCategory,
    selectedVerbType,
  ]);

  // ---------------- STATS ----------------

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadStats = async () => {
      try {
        const [stats, tasks] = await Promise.all([
          fetchStatistics(),
          fetchTrainingTasks(),
        ]);

        setStatistics(stats);
        setTasksCount(tasks.length);
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
  }, [dispatch, isAuthenticated]);

  // ---------------- ACTIONS ----------------

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleAddWord = async (values: CreateWordPayload) => {
    await addWord(values);
    dispatch(setPage(1));
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
  };

  const handleDeleteWord = async (word: Word) => {
    await deleteWord(word.id);

    dispatch(
      showNotification({
        message: "Word deleted successfully",
        type: "success",
      })
    );
  };

  // ---------------- UI ----------------

  const showEmpty = !loading && hasLoadedRef.current && words.length === 0;
  const hasActiveFilters = useMemo(
    () => Boolean(searchQuery.trim() || selectedCategory || selectedVerbType),
    [searchQuery, selectedCategory, selectedVerbType]
  );

  useEffect(() => {
    if (showEmpty && hasActiveFilters && !emptyNotificationShownRef.current) {
      dispatch(
        showNotification({
          message: "No words yet",
          type: "info",
        })
      );
      emptyNotificationShownRef.current = true;
      return;
    }

    if (!showEmpty) {
      emptyNotificationShownRef.current = false;
    }
  }, [dispatch, hasActiveFilters, showEmpty]);

  return (
    <section className={styles.dictionaryPage}>
      <div className="container">
        <Dashboard
          onSearch={setSearchQuery}
          onCategoryChange={(value) => {
            setSelectedCategory(value);
            dispatch(setPage(1));
          }}
          onVerbTypeChange={setSelectedVerbType}
          onAddWord={() => setShowAddModal(true)}
          totalWords={statistics.totalCount}
          tasksCount={tasksCount}
        />

        {loading && <p>Loading...</p>}

        {!loading && words.length > 0 && (
          <>
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
          </>
        )}

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
