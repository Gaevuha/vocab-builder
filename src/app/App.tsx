import { BrowserRouter, HashRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Notification } from "../components/common/Notification/Notification";
import { AuthBootstrap } from "./router/AuthBootstrap";

const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router>
      <Notification />
      <AuthBootstrap>
        <AppRoutes />
      </AuthBootstrap>
    </Router>
  );
}
