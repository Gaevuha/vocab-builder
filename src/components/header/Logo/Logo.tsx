import { Link } from "react-router-dom";
import { routes } from "../../../app/routes";
import styles from "./Logo.module.css";

interface LogoProps {
  page?: "login" | "register";
}

export function Logo({ page }: LogoProps) {
  return (
    <Link
      className={`${styles.logoLink} ${
        page === "login" ? styles.logoLinkLogin : ""
      } ${page === "register" ? styles.logoLinkRegister : ""}`}
      to={routes.dictionary}
    >
      <svg className={styles.iconLogo}>
        <use xlinkHref="/icons/sprite.svg#icon-logo" />
      </svg>
      Vocab Builder
    </Link>
  );
}
