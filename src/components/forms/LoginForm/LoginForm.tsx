import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PasswordField } from "../../common/PasswordField/PasswordField";
import {
  loginSchema,
  PASSWORD_SUCCESS_MESSAGE,
} from "../../../utils/validation";

import { Link } from "react-router-dom";
import styles from "./LoginForm.module.css";

export type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const passwordValue = watch("password", "");

  return (
    <form className={styles.formLogin} onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div className={styles.fieldLogin}>
        <label htmlFor="email" className={styles.visuallyHidden}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`${styles.inputLogin} ${errors.email ? styles.error : ""}`}
        />
        {errors.email && (
          <span className={styles.fieldError}>{errors.email.message}</span>
        )}
      </div>

      {/* Password */}
      <PasswordField<LoginFormValues>
        label="Password"
        name="password"
        placeholder="Password"
        register={register}
        error={isSubmitted ? errors.password : undefined}
        value={isSubmitted ? passwordValue : ""}
        successMessage={
          isSubmitted && !errors.password && passwordValue
            ? PASSWORD_SUCCESS_MESSAGE
            : undefined
        }
      />

      <button type="submit" disabled={isLoading} className={styles.formBtn}>
        {isLoading ? "Loading..." : "Login"}
      </button>

      <Link to="/register" className={styles.formLink}>
        Register
      </Link>
    </form>
  );
}
