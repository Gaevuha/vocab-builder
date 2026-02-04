import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/Header/Header";
import { Notification } from "../../components/common/Notification/Notification";

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Notification />
    </div>
  );
}
