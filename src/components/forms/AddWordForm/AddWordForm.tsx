import { useAppSelector } from "../../../store/hooks";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { InferType } from "yup";
import { addWordSchema } from "../../../utils/validation";

export type AddWordFormValues = InferType<typeof addWordSchema>;

type AddWordFormProps = {
  onSubmit: (values: AddWordFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function AddWordForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: AddWordFormProps) {
  const categories = useAppSelector((state) => state.categories.items);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddWordFormValues>({
    resolver: yupResolver(addWordSchema) as Resolver<AddWordFormValues>,
    mode: "onSubmit",
  });

  const selectedCategory = useWatch({ control, name: "category" });

  return (
    <form className="word-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Category */}
      <label className="field">
        <span>Category</span>
        <select {...register("category")}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="field__error">{errors.category.message}</span>
        )}
      </label>

      {/* Verb type */}
      {selectedCategory === "verb" && (
        <div className="field">
          <span>Verb type</span>
          <label>
            <input type="radio" value="regular" {...register("verbType")} />{" "}
            Regular
          </label>
          <label>
            <input type="radio" value="irregular" {...register("verbType")} />{" "}
            Irregular
          </label>
        </div>
      )}

      {/* English word */}
      <label className="field">
        <span>EN</span>
        <input type="text" placeholder="English" {...register("en")} />
        {errors.en && <span className="field__error">{errors.en.message}</span>}
      </label>

      {/* Ukrainian word */}
      <label className="field">
        <span>UA</span>
        <input type="text" placeholder="Ukrainian" {...register("ua")} />
        {errors.ua && <span className="field__error">{errors.ua.message}</span>}
      </label>

      {/* Buttons */}
      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          Add
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
