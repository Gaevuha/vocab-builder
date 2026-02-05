import { Link } from "react-router-dom";
import { routes } from "../../../app/routes";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <Link className={styles.logoLink} to={routes.dictionary}>
      <svg className={styles.iconLogo}>
        <use xlinkHref="/icons/sprite.svg#icon-logo" />
      </svg>
      Vocab Builder
    </Link>
  );
}
