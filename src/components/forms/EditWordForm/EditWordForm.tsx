import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { editWordSchema } from "../../../utils/validation";
import type { Word } from "../../../types/words";

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
    <form className="word-form" onSubmit={handleSubmit(onSubmit)}>
      <label className="field">
        <span>EN</span>
        <input type="text" placeholder="English" {...register("en")} />
        {errors.en ? (
          <span className="field__error">{errors.en.message}</span>
        ) : null}
      </label>

      <label className="field">
        <span>UA</span>
        <input type="text" placeholder="Ukrainian" {...register("ua")} />
        {errors.ua ? (
          <span className="field__error">{errors.ua.message}</span>
        ) : null}
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
