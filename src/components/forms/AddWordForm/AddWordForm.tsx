import { useAppSelector } from "../../../store/hooks";
import { useEffect } from "react";
import { CategorySelect } from "../../common/CategorySelect/CategorySelect";
import { useForm, useWatch, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { InferType } from "yup";
import { addWordSchema } from "../../../utils/validation";
import styles from "./AddWordForm.module.css";

export type AddWordFormValues = InferType<typeof addWordSchema>;

type VerbTypeClasses = {
  fieldset?: string;
  radioGroup?: string;
  radioItem?: string;
  radioInput?: string;
  radioLabel?: string;
  radioIcon?: string;
};

type AddWordFormProps = {
  onSubmit: (values: AddWordFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  verbTypeClasses?: VerbTypeClasses;
};

export function AddWordForm({
  onSubmit,
  onCancel,
  isLoading = false,
  verbTypeClasses = {},
}: AddWordFormProps) {
  const categories = useAppSelector((state) => state.categories.items);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddWordFormValues>({
    resolver: yupResolver(addWordSchema) as Resolver<AddWordFormValues>,
    mode: "onSubmit",
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const selectedVerbType = useWatch({ control, name: "verbType" });
  useEffect(() => {
    if (selectedCategory === "verb") {
      if (!getValues("verbType")) {
        setValue("verbType", "regular");
      }
    } else {
      setValue("verbType", undefined);
    }
  }, [selectedCategory, setValue, getValues]);

  return (
    <form className={styles.addWordForm} onSubmit={handleSubmit(onSubmit)}>
      {/* Category */}
      <label className={styles.field}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategorySelect
              categories={categories}
              value={field.value}
              onChange={field.onChange}
              buttonActiveClassName={styles.modalCategoryButtonActive}
              className={`${styles.modalCategorySelect} ${
                selectedCategory === "verb"
                  ? styles.modalCategorySelectNoMargin
                  : ""
              }`}
              buttonClassName={styles.modalCategoryButton}
              dropdownClassName={styles.modalCategoryDropdown}
              wrapperClassName={styles.modalCategoryWrapper}
            />
          )}
        />
        {errors.category && (
          <span className={styles.fieldError}>{errors.category.message}</span>
        )}
      </label>
      {/* Verb type */}
      {selectedCategory === "verb" && (
        <fieldset
          className={`${verbTypeClasses.fieldset ?? styles.fieldVerb} ${
            selectedVerbType === "irregular" ? styles.fieldVerbIrregular : ""
          }`}
        >
          <div className={verbTypeClasses.radioGroup ?? styles.radioGroup}>
            <div className={verbTypeClasses.radioItem ?? styles.radioItem}>
              <input
                id="regular"
                type="radio"
                value="regular"
                {...register("verbType")}
                className={verbTypeClasses.radioInput ?? styles.radioInput}
              />
              <label
                htmlFor="regular"
                className={verbTypeClasses.radioLabel ?? styles.radioLabel}
              >
                <span
                  className={verbTypeClasses.radioIcon ?? styles.radioIcon}
                />
                Regular
              </label>
            </div>

            <div className={verbTypeClasses.radioItem ?? styles.radioItem}>
              <input
                id="irregular"
                type="radio"
                value="irregular"
                {...register("verbType")}
                className={verbTypeClasses.radioInput ?? styles.radioInput}
              />
              <label
                htmlFor="irregular"
                className={verbTypeClasses.radioLabel ?? styles.radioLabel}
              >
                <span
                  className={verbTypeClasses.radioIcon ?? styles.radioIcon}
                />
                Irregular
              </label>
            </div>
          </div>

          {selectedVerbType === "irregular" && (
            <p className={styles.helperText}>
              Such data must be entered in the format I form-II form-III form.
            </p>
          )}
        </fieldset>
      )}
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
