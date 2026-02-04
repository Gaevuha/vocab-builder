import { useState } from "react";
import type { FieldError, UseFormRegister, Path } from "react-hook-form";

export type PasswordFieldProps<FormValues extends Record<string, unknown>> = {
  name: Path<FormValues>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<FormValues>;
  error?: FieldError;
};

export function PasswordField<FormValues extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  register,
  error,
}: PasswordFieldProps<FormValues>) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="field">
      <span>{label}</span>
      <div className="field__password">
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label="Toggle password"
        >
          {visible ? "🙈" : "👁"}
        </button>
      </div>
      {error ? <span className="field__error">{error.message}</span> : null}
    </label>
  );
}
