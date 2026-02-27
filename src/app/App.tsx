import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Notification } from "../components/common/Notification/Notification";

export default function App() {
  return (
    <BrowserRouter>
      <Notification />
      <AppRoutes />
    </BrowserRouter>
  );
}
