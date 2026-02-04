import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PasswordField } from "../../common/PasswordField/PasswordField";
import { loginSchema } from "../../../utils/validation";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <label className="field">
        <span>Email</span>
        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email ? (
          <span className="field__error">{errors.email.message}</span>
        ) : null}
      </label>

      <PasswordField<LoginFormValues>
        label="Password"
        name="password"
        placeholder="Password"
        register={register}
        error={errors.password}
      />

      <button type="submit" disabled={isLoading}>
        Login
      </button>
    </form>
  );
}
