import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearCredentials } from "../../../store/slices/authSlice";

export function UserBar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return (
    <div className="user-bar">
      <span>{user?.name ?? "User"}</span>
      <button type="button" onClick={() => dispatch(clearCredentials())}>
        Logout
      </button>
    </div>
  );
}
