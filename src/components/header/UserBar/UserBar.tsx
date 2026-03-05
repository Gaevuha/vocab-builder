import { useAppSelector } from "../../../store/hooks";
import { LogoutButton } from "../../common/LogoutButton/LogoutButton";

import styles from "./UserBar.module.css";

type UserNameProps = {
  variant?: "menu" | "default";
};

export function UserName({ variant = "default" }: UserNameProps) {
  const user = useAppSelector((state) => state.auth.user);

  const displayName = user?.name?.trim().split(/\s+/)[0] ?? "User";

  return (
    <span
      className={variant === "menu" ? styles.userNameMenu : styles.userName}
    >
      {displayName}
      <div className={styles.userIconWrapper}>
        <svg className={styles.userIcon} aria-hidden="true">
          <use xlinkHref="/icons/sprite.svg#icon-user" />
        </svg>
      </div>
    </span>
  );
}

export function UserBar() {
  return (
    <div className={styles.userBar}>
      <UserName />
      <LogoutButton />
    </div>
  );
}
