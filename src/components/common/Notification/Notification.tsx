import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearNotification } from "../../../store/slices/uiSlice";
import styles from "./Notification.module.css";

export function Notification() {
  const notification = useAppSelector((state) => state.ui.notification);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notification]);

  if (!notification) {
    return null;
  }

  return (
    <div
      className={`${styles.notification} ${
        styles[`notification--${notification.type}`]
      }`}
      role="status"
    >
      <span>{notification.message}</span>
    </div>
  );
}
