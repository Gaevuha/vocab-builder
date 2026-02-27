import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";

import {
  RegisterForm,
  type RegisterFormValues,
} from "../../components/forms/RegisterForm/RegisterForm";

import { routes } from "../../app/routes";
import { registerUser } from "../../services/auth";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { showNotification } from "../../store/slices/uiSlice";

import { Logo } from "../../components/header/Logo/Logo";
import styles from "../LoginPage/AuthPage.module.css";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
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
    <section className={styles.sectionRegisterPage}>
      <div
        className={`${styles.wrapperLogoImgTag} ${styles.wrapperLogoImgTagRegister} container`}
      >
        <Logo page="register" />

        {isDesktop && (
          <div className={styles.wrapperContent}>
            <div className={styles.wrapperImgText}>
              <div
                className={`${styles.wrapperImgMobile} ${styles.wrapperImgMobileRegister}`}
              >
                <picture>
                  <source
                    srcSet="/img/login-page.webp 1x, /img/login-page@2x.webp 2x"
                    media="(min-width: 1440px)"
                  />
                  <img
                    src="/img/login-page-mobile.webp"
                    srcSet="/img/login-page-mobile.webp 1x, /img/login-page-mobile@2x.webp 2x"
                    alt="Register page illustration"
                    className={styles.imgMobileMenu}
                  />
                </picture>
              </div>

              <p className={styles.tagline}>
                Word · Translation · Grammar · Progress
              </p>
            </div>

            <div className={styles.wrapperFormBtn}>
              <h1 className={styles.title}>Register</h1>
              <p
                className={`${styles.textLoginPage} ${styles.textLoginPageRegister}`}
              >
                To start using our services, please fill out the registration
                form below. All fields are mandatory:
              </p>

              <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        )}

        {isMobile && (
          <div
            className={`${styles.wrapperImgMobile} ${styles.wrapperImgMobileRegister}`}
          >
            <picture>
              <source
                srcSet="/img/login-page.webp 1x, /img/login-page@2x.webp 2x"
                media="(min-width: 1440px)"
              />
              <img
                src="/img/login-page-mobile.webp"
                srcSet="/img/login-page-mobile.webp 1x, /img/login-page-mobile@2x.webp 2x"
                alt="Register page illustration"
                className={styles.imgMobileMenu}
              />
            </picture>
          </div>
        )}
      </div>

      {(!isDesktop || isTablet) && (
        <div className={styles.wrapperFormBtn}>
          <h1 className={styles.title}>Register</h1>
          <p
            className={`${styles.textLoginPage} ${styles.textLoginPageRegister}`}
          >
            To start using our services, please fill out the registration form
            below. All fields are mandatory:
          </p>

          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      )}

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

      {isDesktop && (
        <div className={styles.wrapperBgVector}>
          <svg className={styles.bgVector}>
            <use xlinkHref="/icons/sprite.svg#icon-bg-vector" />
          </svg>
        </div>
      )}
    </section>
  );
}
