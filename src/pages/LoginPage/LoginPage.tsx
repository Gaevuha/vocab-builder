import { Link, useNavigate } from "react-router-dom";
import {
  LoginForm,
  type LoginFormValues,
} from "../../components/forms/LoginForm/LoginForm";
import { routes } from "../../app/routes";
import { loginUser } from "../../services/auth";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/uiSlice";
import { Notification } from "../../components/common/Notification/Notification";
import { useState } from "react";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: LoginFormValues) {
    try {
      setIsLoading(true);
      const response = await loginUser(values);
      dispatch(setCredentials(response));
      navigate(routes.dictionary, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      dispatch(showNotification({ message, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      <p>
        Don’t have an account? <Link to={routes.register}>Register</Link>
      </p>
      <Notification />
    </div>
  );
}
