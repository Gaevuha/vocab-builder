import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import {
  LoginForm,
  type LoginFormValues,
} from "../../components/forms/LoginForm/LoginForm";
import { routes } from "../../app/routes";
import { loginUser } from "../../services/auth";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/uiSlice";
import styles from "./AuthPage.module.css";
import { Logo } from "../../components/header/Logo/Logo";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  async function handleSubmit(values: LoginFormValues) {
    try {
      setIsLoading(true);

      const response = await loginUser(values);
      dispatch(setCredentials(response));
      navigate(routes.dictionary, { replace: true });
    } catch (error) {
      let message = "Login failed";

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      dispatch(showNotification({ message, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  }
  if (isDesktop) {
    return (
      <section className={styles.sectionLoginPage}>
        <div className={`${styles.wrapperLogoImgTag} container`}>
          <Logo page="login" />
          <div className={styles.wrapperContent}>
            <div className={styles.wraperImgText}>
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

              <p className={styles.tagline}>
                Word · Translation · Grammar · Progress
              </p>
            </div>
            <div className={styles.wrapperFormBtn}>
              <h1 className={styles.title}>Login</h1>
              <p className={styles.textLoginPage}>
                Please enter your login details to continue using our service:
              </p>

              <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
        <div className={styles.wrapperBgVector}>
          <svg className={styles.bgVector}>
            <use xlinkHref="/icons/sprite.svg#icon-bg-vector" />
          </svg>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.sectionLoginPage}>
      <div className={`${styles.wrapperLogoImgTag} container`}>
        <Logo />

        {isMobile && (
          <>
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

            <p className={styles.tagline}>
              Word · Translation · Grammar · Progress
            </p>
          </>
        )}
      </div>

      <div className={styles.wrapperFormBtn}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.textLoginPage}>
          Please enter your login details to continue using our service:
        </p>

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {isTablet && (
        <>
          <p className={styles.taglineTable}>
            Word · Translation · Grammar · Progress
          </p>

          <div className={styles.wrapperBgVector}>
            <svg className={styles.bgVector}>
              <use xlinkHref="/icons/sprite.svg#icon-bg-vector" />
            </svg>
          </div>
        </>
      )}
    </section>
  );
}
