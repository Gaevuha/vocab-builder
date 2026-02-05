import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearCredentials, setUser } from "../../../store/slices/authSlice";
import { getCurrentUser } from "../../../services/auth";
import styles from "./UserBar.module.css";

type UserNameProps = {
  className?: string;
  variant?: "menu" | "default";
};

export function UserName({ className, variant = "default" }: UserNameProps) {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const displayName = user?.name?.trim().split(/\s+/)[0] ?? "User";
  const nameClassName = [
    styles.userName,
    variant === "menu" ? styles.userNameMenu : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!user && token) {
      getCurrentUser()
        .then((currentUser) => {
          dispatch(setUser(currentUser));
        })
        .catch(() => {
          dispatch(clearCredentials());
        });
    }
  }, [dispatch, token, user]);

  return (
    <span className={nameClassName}>
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
  const dispatch = useAppDispatch();

  return (
    <div className={styles.userBar}>
      <UserName />
      <button
        className={styles.btnLogout}
        type="button"
        onClick={() => dispatch(clearCredentials())}
      >
        Logout
      </button>
    </div>
  );
}
