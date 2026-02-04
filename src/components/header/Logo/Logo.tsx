import { Link } from "react-router-dom";
import { routes } from "../../../app/routes";

export function Logo() {
  return (
    <Link className="logo" to={routes.dictionary}>
      Vocab Builder
    </Link>
  );
}
