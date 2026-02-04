import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { DictionaryPage } from "../pages/DictionaryPage/DictionaryPage";
import { RecommendPage } from "../pages/RecommendPage/RecommendPage";
import { TrainingPage } from "../pages/TrainingPage/TrainingPage";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./router/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={routes.register} element={<RegisterPage />} />
      <Route path={routes.login} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to={routes.dictionary} replace />} />
          <Route path={routes.dictionary} element={<DictionaryPage />} />
          <Route path={routes.recommend} element={<RecommendPage />} />
          <Route path={routes.training} element={<TrainingPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={routes.login} replace />} />
    </Routes>
  );
}
