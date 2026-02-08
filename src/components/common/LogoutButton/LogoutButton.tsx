import { useAppDispatch } from "../../../store/hooks";
import { clearCredentials } from "../../../store/slices/authSlice";
import styles from "./LogoutButton.module.css";

type LogoutButtonProps = {
  onLogout?: () => void;
  className?: string;
};

export function LogoutButton({ onLogout, className }: LogoutButtonProps) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    onLogout?.();
  };

  return (
    <button
      type="button"
      className={`${styles.logoutButton} ${className ?? ""}`}
      onClick={handleLogout}
    >
      Log out
      <svg className={styles.iconArrowLogout} aria-hidden="true">
        <use xlinkHref="/icons/sprite.svg#icon-arrow-logout" />
      </svg>
    </button>
  );
}
