import { useEffect, useRef, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import styles from "./CategorySelect.module.css";

type CategorySelectProps = {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  buttonActiveClassName?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  wrapperClassName?: string;
};

export function CategorySelect({
  categories,
  value,
  onChange,
  className,
  buttonClassName,
  dropdownClassName,
  wrapperClassName,
  buttonActiveClassName,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setIsOpen(false);
    buttonRef.current?.blur();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`${styles.field} ${className || ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.customSelect} ${buttonClassName || ""} ${
          isOpen ? buttonActiveClassName || "" : ""
        }`}
        onClick={() => {
          setIsOpen((prev) => {
            if (prev) {
              buttonRef.current?.blur();
            }
            return !prev;
          });
        }}
      >
        <span>
          {value
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : "Categories"}
        </span>
        <SlArrowDown
          className={`${styles.iconSelect} ${isOpen ? styles.open : ""}`}
        />
      </button>

      {isOpen && (
        <div className={`${styles.wrapperSelect} ${wrapperClassName || ""}`}>
          <ul className={`${styles.dropdown} ${dropdownClassName || ""}`}>
            <li
              className={`${styles.option} ${!value ? styles.selected : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange("");
                close();
              }}
            >
              Categories
            </li>

            {categories.map((item) => (
              <li
                key={item}
                className={`${styles.option} ${
                  value === item ? styles.selected : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(item);
                  close();
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
