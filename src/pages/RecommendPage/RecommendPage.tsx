import { useCallback, useEffect, useRef, useState } from "react";
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
import styles from "./RecommendPage.module.css";

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
  const requestIdRef = useRef(0);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const loadWords = useCallback(
    async (currentPage: number) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      try {
        setLoading(true);
        const data = await fetchAllWords({
          keyword: searchQuery || undefined,
          category: selectedCategory || undefined,
          isIrregular:
            selectedCategory === "verb"
              ? selectedVerbType === "irregular"
              : undefined,
          page: currentPage,
          limit: wordsState.perPage,
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
    [
      dispatch,
      searchQuery,
      selectedCategory,
      selectedVerbType,
      wordsState.perPage,
    ]
  );

  useEffect(() => {
    dispatch(setPage(1));
    loadWords(1);
  }, [dispatch, loadWords]);

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
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedVerbType("");
  };

  const handleVerbTypeChange = (value: string) => {
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
    <section className={styles.recommendPage}>
      <div className="container">
        <Dashboard
          showAddWord={false}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onVerbTypeChange={handleVerbTypeChange}
          totalWords={statistics.totalCount}
          tasksCount={tasksCount}
        />
        {loading && wordsState.items.length === 0 && <p>Loading...</p>}
        <WordsTable
          words={wordsState.items}
          withActions={false}
          onAddToDictionary={handleAddToDictionary}
          tableMode="recommend"
        />
        <WordsPagination
          page={wordsState.page}
          totalPages={wordsState.totalPages}
          onPageChange={(page) => {
            dispatch(setPage(page));
            loadWords(page);
          }}
        />
      </div>
    </section>
  );
}
