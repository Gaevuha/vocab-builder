import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { editWordSchema } from "../../../utils/validation";
import type { Word } from "../../../types/words";
import styles from "./EditWordForm.module.css";

export type EditWordFormValues = {
  en: string;
  ua: string;
};

export type EditWordFormProps = {
  word: Word;
  onSubmit: (values: EditWordFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function EditWordForm({
  word,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditWordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditWordFormValues>({
    resolver: yupResolver(editWordSchema),
    mode: "onSubmit",
    defaultValues: {
      en: word.en,
      ua: word.ua,
    },
  });

  return (
    <form className={styles.editWordForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.wrapperModalInput}>
        {/* Ukrainian word */}
        <div className={styles.field}>
          <label htmlFor="ua">
            <svg className={styles.iconUa}>
              <use xlinkHref="/icons/sprite.svg#icon-ukraine" />
            </svg>
            Ukrainian
          </label>
          <input
            id="ua"
            type="text"
            className={styles.inputModal}
            placeholder="Ukrainian"
            autoComplete="new-password"
            {...register("ua")}
          />
          {errors.ua && (
            <span className={styles.fieldError}>{errors.ua.message}</span>
          )}
        </div>

        {/* English word */}
        <div className={styles.field}>
          <label htmlFor="en">
            {" "}
            <svg className={styles.iconEn}>
              <use xlinkHref="/icons/sprite.svg#icon-united-kingdom" />
            </svg>
            English
          </label>
          <input
            id="en"
            type="text"
            className={styles.inputModal}
            placeholder="English"
            autoComplete="new-password"
            {...register("en")}
          />
          {errors.en && (
            <span className={styles.fieldError}>{errors.en.message}</span>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className={styles.formActions}>
        <button className={styles.btnAdd} type="submit" disabled={isLoading}>
          Add
        </button>
        <button className={styles.btnCancel} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
