import { NavLink } from "react-router-dom";
import { routes } from "../../../app/routes";
import styles from "./UserNav.module.css";

export type UserNavProps = {
  className?: string; // <-- ось тут
};
export function UserNav({ className }: UserNavProps) {
  return (
    <nav className={`${styles.userNav} ${className || ""}`}>
      <NavLink
        to={routes.dictionary}
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        Dictionary
      </NavLink>
      <NavLink
        to={routes.recommend}
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        Recommend
      </NavLink>
      <NavLink
        to={routes.training}
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        Training
      </NavLink>
    </nav>
  );
}
