import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearNotification } from "../../../store/slices/uiSlice";

export function Notification() {
  const notification = useAppSelector((state) => state.ui.notification);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(clearNotification());
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notification]);

  if (!notification) {
    return null;
  }

  return (
    <div
      className={`notification notification--${notification.type}`}
      role="status"
    >
      <span>{notification.message}</span>
      <button type="button" onClick={() => dispatch(clearNotification())}>
        ✕
      </button>
    </div>
  );
}
