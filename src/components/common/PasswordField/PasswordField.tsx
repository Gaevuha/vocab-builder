import { useState } from "react";
import type { FieldError, UseFormRegister, Path } from "react-hook-form";

import styles from "./PasswordField.module.css";

export type PasswordFieldProps<FormValues extends Record<string, unknown>> = {
  name: Path<FormValues>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  value?: string;
  successMessage?: string;
};

export function PasswordField<FormValues extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  register,
  error,
  successMessage,
}: PasswordFieldProps<FormValues>) {
  const [visible, setVisible] = useState(false);
  const inputId = `password-${String(name)}`;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        {label}
      </label>

      <div className={styles.fieldPassword}>
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className={`${styles.inputPwd} ${error ? styles.error : ""}`}
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label="Toggle password visibility"
          className={styles.toggleButton}
        >
          {visible ? (
            <svg className={styles.icon}>
              <use xlinkHref="/icons/sprite.svg#icon-eye" />
            </svg>
          ) : (
            <svg className={styles.icon}>
              <use xlinkHref="/icons/sprite.svg#icon-eye-off" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <span className={styles.fieldError}>
          <svg className={styles.iconMessage}>
            <use xlinkHref="/icons/sprite.svg#icon-error" />
          </svg>
          {error.message}
        </span>
      )}
      {successMessage && (
        <span className={styles.successMessage}>
          <svg className={styles.iconMessage}>
            <use xlinkHref="/icons/sprite.svg#icon-success" />
          </svg>
          {successMessage}
        </span>
      )}
    </div>
  );
}
