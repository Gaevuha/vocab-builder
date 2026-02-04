import { useCallback, useEffect, useState } from "react";
import { Dashboard } from "../../components/dashboard/Dashboard/Dashboard";
import { WordsTable } from "../../components/common/WordsTable/WordsTable";
import { WordsPagination } from "../../components/common/WordsPagination/WordsPagination";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadCategories } from "../../store/slices/categoriesSlice";
import { setPage, setWords } from "../../store/slices/wordsSlice";
import { showNotification } from "../../store/slices/uiSlice";
import type { Statistics, Word } from "../../types/words";
import {
  addForeignWord,
  fetchAllWords,
  fetchStatistics,
} from "../../services/words";
import { fetchTrainingTasks } from "../../services/training";

export function RecommendPage() {
  const dispatch = useAppDispatch();
  const wordsState = useAppSelector((state) => state.words);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVerbType, setSelectedVerbType] = useState("");
  const [statistics, setStatistics] = useState<Statistics>({
    totalCount: 0,
  });
  const [tasksCount, setTasksCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const loadWords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllWords({
        keyword: searchQuery || undefined,
        category: selectedCategory || undefined,
        isIrregular:
          selectedCategory === "verb"
            ? selectedVerbType === "irregular"
            : undefined,
        page: wordsState.page,
        limit: wordsState.perPage,
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
    searchQuery,
    selectedCategory,
    selectedVerbType,
    wordsState.page,
    wordsState.perPage,
  ]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

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

  async function handleAddToDictionary(word: Word) {
    try {
      await addForeignWord(word.id);
      dispatch(
        showNotification({
          message: "Word added to dictionary",
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
  }

  return (
    <section className="page">
      <h1>Recommend</h1>
      <Dashboard
        showAddWord={false}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onVerbTypeChange={handleVerbTypeChange}
        totalWords={statistics.totalCount}
        tasksCount={tasksCount}
      />
      {loading && <p>Loading...</p>}
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
