import { useEffect, useState } from "react";
import { Logo } from "../Logo/Logo";
import { UserNav } from "../UserNav/UserNav";
import { UserName } from "../UserBar/UserBar";
import { useAppDispatch } from "../../../store/hooks";
import { clearCredentials } from "../../../store/slices/authSlice";
import { LogoutButton } from "../../common/LogoutButton/LogoutButton";
import styles from "./HeaderMobile.module.css";

export function HeaderMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  return (
    <header className={`${styles.headerMobile} container`}>
      <div
        className={`${styles.topBar} ${menuOpen ? styles.headerDimmed : ""}`}
      >
        <Logo />
        {!menuOpen && (
          <div className={styles.wrapperUserBurger}>
            <UserName />
            <button
              className={styles.burger}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        )}
      </div>

      {menuOpen && (
        <>
          <button
            className={styles.backdrop}
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />

          <nav className={styles.appNav}>
            <div className={styles.wrapperContentMobile}>
              {/* Верхній блок */}
              <div className={styles.menuHeader}>
                <UserName variant="menu" />
                <button
                  className={`${styles.burger} ${styles.active}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>

              <UserNav className={styles.userNavMobile} />

              <LogoutButton
                className={styles.logoutButton}
                onLogout={handleLogout}
              />
            </div>
            <div className={styles.wrapperImgMobile}>
              <picture>
                <source
                  srcSet="/img/illustration-tablet.webp 1x, /img/illustration-tablet@2x.webp 2x"
                  media="(min-width: 768px)"
                />
                <img
                  src="/img/illustration-mobile.webp"
                  srcSet="/img/illustration-mobile.webp 1x, /img/illustration-mobile@2x.webp 2x"
                  alt="Illustration"
                  className={styles.imgMobileMenu}
                />
              </picture>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
