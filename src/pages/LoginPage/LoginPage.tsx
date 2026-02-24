import { useNavigate } from "react-router-dom";
import {
  LoginForm,
  type LoginFormValues,
} from "../../components/forms/LoginForm/LoginForm";
import { routes } from "../../app/routes";
import { loginUser } from "../../services/auth";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/uiSlice";
import { useState } from "react";
import styles from "./LoginPage.module.css";
import { Logo } from "../../components/header/Logo/Logo";

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
    <section className={styles.sectionLoginPage}>
      <div className={`${styles.containerLoginPage} container`}>
        <Logo />
        <div className={styles.wrapperImgMobile}>
          <picture>
            <source
              srcSet="/img/login-page.webp 1x, /img/login-page@2x.webp 2x"
              media="(min-width: 1440px)"
            />
            <img
              src="/img/login-page-mobile.webp"
              srcSet="/img/login-page-mobile.webp 1x, /img/login-page-mobile@2x.webp 2x"
              alt="Login page illustration"
              className={styles.imgMobileMenu}
            />
          </picture>
        </div>
        <span className={styles.tagline}>
          Word · Translation · Grammar · Progress
        </span>
        <h1>Login</h1>
        <p>Please enter your login details to continue using our service:</p>
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </section>
  );
}
