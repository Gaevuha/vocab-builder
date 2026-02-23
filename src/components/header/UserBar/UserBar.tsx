import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearCredentials, setUser } from "../../../store/slices/authSlice";
import { getCurrentUser } from "../../../services/auth";
import { LogoutButton } from "../../common/LogoutButton/LogoutButton";

import styles from "./UserBar.module.css";

type UserNameProps = {
  variant?: "menu" | "default";
};

export function UserName({ variant = "default" }: UserNameProps) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const displayName = user?.name?.trim().split(/\s+/)[0] ?? "User";

  useEffect(() => {
    if (!user) {
      getCurrentUser()
        .then((currentUser) => dispatch(setUser(currentUser)))
        .catch(() => dispatch(clearCredentials()));
    }
  }, [dispatch, user]);

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
