import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { routes } from "../routes";

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
