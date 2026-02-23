import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useAppSelector } from "../../../store/hooks";
import { CategorySelect } from "../../common/CategorySelect/CategorySelect";
import styles from "./Filters.module.css";

export type FiltersProps = {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVerbTypeChange?: (value: string) => void;
  verbTypeClasses?: {
    fieldset?: string;
    radioGroup?: string;
    radioItem?: string;
    radioInput?: string;
    radioLabel?: string;
    radioIcon?: string;
  };
};

export function Filters({
  onSearch,
  onCategoryChange,
  onVerbTypeChange,
  verbTypeClasses = {},
}: FiltersProps) {
  const categories = useAppSelector((state) => state.categories.items);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [verbType, setVerbType] = useState("");

  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  // Debounced пошук
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Category change
  useEffect(() => {
    onCategoryChange(category);
  }, [category, onCategoryChange]);

  // Verb type change
  useEffect(() => {
    if (category === "verb" && onVerbTypeChange) {
      onVerbTypeChange(verbType);
    }
  }, [category, onVerbTypeChange, verbType]);

  return (
    <div className={styles.filters}>
      {/* Search */}
      <div className={styles.field}>
        <label htmlFor="search" className={styles.visuallyHidden}>
          Search
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="search"
            type="text"
            className={styles.input}
            placeholder="Find the word"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className={styles.iconSearch}>
            <use href="/icons/sprite.svg#icon-search" />
          </svg>
        </div>
      </div>

      {/* CategorySelect замість власного dropdown */}
      <CategorySelect
        categories={categories}
        value={category}
        onChange={(value) => {
          setCategory(value);

          if (value === "verb") {
            setVerbType("regular");
          } else {
            setVerbType("");
          }
        }}
      />

{category === "verb" && (
  <fieldset className={verbTypeClasses?.fieldset || styles.fieldset}>
    <div className={verbTypeClasses?.radioGroup || styles.radioGroup}>
      <div className={verbTypeClasses?.radioItem || styles.radioItem}>
        <input
          id="regular"
          type="radio"
          name="verbType"
          checked={verbType === "regular"}
          onChange={() => setVerbType("regular")}
          className={verbTypeClasses?.radioInput || styles.radioInput}
        />
        <label htmlFor="regular" className={verbTypeClasses?.radioLabel || styles.radioLabel}>
          <span className={verbTypeClasses?.radioIcon || styles.radioIcon} />
          Regular
        </label>
      </div>

      <div className={verbTypeClasses?.radioItem || styles.radioItem}>
        <input
          id="irregular"
          type="radio"
          name="verbType"
          checked={verbType === "irregular"}
          onChange={() => setVerbType("irregular")}
          className={verbTypeClasses?.radioInput || styles.radioInput}
        />
        <label htmlFor="irregular" className={verbTypeClasses?.radioLabel || styles.radioLabel}>
          <span className={verbTypeClasses?.radioIcon || styles.radioIcon} />
          Irregular
        </label>
      </div>
    </div>
  </fieldset>
)}
</div>
  );
}
