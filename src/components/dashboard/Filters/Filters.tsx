import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useAppSelector } from "../../../store/hooks";

export type FiltersProps = {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVerbTypeChange?: (value: string) => void;
};

export function Filters({
  onSearch,
  onCategoryChange,
  onVerbTypeChange,
}: FiltersProps) {
  const categories = useAppSelector((state) => state.categories.items);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [verbType, setVerbType] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  useEffect(() => {
    onCategoryChange(category);
  }, [category, onCategoryChange]);

  useEffect(() => {
    if (category === "verb" && onVerbTypeChange) {
      onVerbTypeChange(verbType);
    }
  }, [category, onVerbTypeChange, verbType]);

  return (
    <div className="filters">
      <label className="field">
        <span>Search</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
        />
      </label>

      <label className="field">
        <span>Category</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All</option>
          {categories.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {category === "verb" ? (
        <div className="field">
          <span>Verb type</span>
          <label>
            <input
              type="radio"
              value="regular"
              checked={verbType === "regular"}
              onChange={() => setVerbType("regular")}
            />
            Regular
          </label>
          <label>
            <input
              type="radio"
              value="irregular"
              checked={verbType === "irregular"}
              onChange={() => setVerbType("irregular")}
            />
            Irregular
          </label>
        </div>
      ) : null}
    </div>
  );
}
