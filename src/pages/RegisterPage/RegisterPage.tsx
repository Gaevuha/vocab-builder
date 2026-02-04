import { Link, useNavigate } from "react-router-dom";
import {
  RegisterForm,
  type RegisterFormValues,
} from "../../components/forms/RegisterForm/RegisterForm";
import { routes } from "../../app/routes";
import { registerUser } from "../../services/auth";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/uiSlice";
import { Notification } from "../../components/common/Notification/Notification";
import { useState } from "react";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: RegisterFormValues) {
    try {
      setIsLoading(true);
      const response = await registerUser(values);
      dispatch(setCredentials(response));
      navigate(routes.dictionary, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      dispatch(showNotification({ message, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Register</h1>
      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
      <p>
        Already have an account? <Link to={routes.login}>Login</Link>
      </p>
      <Notification />
    </div>
  );
}
