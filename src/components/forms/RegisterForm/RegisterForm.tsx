import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PasswordField } from "../../common/PasswordField/PasswordField";
import {
  registerSchema,
  PASSWORD_SUCCESS_MESSAGE,
} from "../../../utils/validation";
import styles from "./RegisterForm.module.css";
import { Link } from "react-router-dom";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

export function RegisterForm({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onSubmit",
  });

  const passwordValue = watch("password", "");

  return (
    <form className={styles.formRegister} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.fieldName}>
        <label htmlFor="name" className={styles.visuallyHidden}>
          Name
        </label>

        <input
          id="name"
          type="text"
          placeholder="Name"
          {...register("name")}
          className={`${styles.inputName} ${errors.name ? styles.error : ""}`}
        />

        {errors.name && (
          <span className={styles.fieldError}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles.fieldLogin}>
        <label htmlFor="email" className={styles.visuallyHidden}>
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
          className={`${styles.inputLogin} ${errors.email ? styles.error : ""}`}
        />

        {errors.email && (
          <span className={styles.fieldError}>{errors.email.message}</span>
        )}
      </div>

      <PasswordField<RegisterFormValues>
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
        Register
      </button>
      <Link to="/login" className={styles.formLink}>
        Login
      </Link>
    </form>
  );
}
