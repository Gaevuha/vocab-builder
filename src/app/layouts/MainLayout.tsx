import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/Header/Header";

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
