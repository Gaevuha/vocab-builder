import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser } from "../../services/auth";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCredentials, setUser } from "../../store/slices/authSlice";

type AuthBootstrapProps = {
  children: ReactNode;
};

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [isReady, setIsReady] = useState(() => !token || Boolean(user));

  const shouldCheckSession = useMemo(
    () => Boolean(token) && !user,
    [token, user]
  );

  useEffect(() => {
    if (!shouldCheckSession) {
      setIsReady(true);
      return;
    }

    let isMounted = true;

    getCurrentUser()
      .then((currentUser) => {
        dispatch(setUser(currentUser));
      })
      .catch(() => {
        dispatch(clearCredentials());
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, shouldCheckSession]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
