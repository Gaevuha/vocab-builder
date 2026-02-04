import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PasswordField } from "../../common/PasswordField/PasswordField";
import { registerSchema } from "../../../utils/validation";

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
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onSubmit",
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <label className="field">
        <span>Name</span>
        <input type="text" placeholder="Name" {...register("name")} />
        {errors.name ? (
          <span className="field__error">{errors.name.message}</span>
        ) : null}
      </label>

      <label className="field">
        <span>Email</span>
        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email ? (
          <span className="field__error">{errors.email.message}</span>
        ) : null}
      </label>

      <PasswordField<RegisterFormValues>
        label="Password"
        name="password"
        placeholder="Password"
        register={register}
        error={errors.password}
      />

      <button type="submit" disabled={isLoading}>
        Register
      </button>
    </form>
  );
}
