import { NavLink } from "react-router-dom";
import { routes } from "../../../app/routes";

export type UserNavProps = {
  onNavigate?: () => void;
};

export function UserNav({ onNavigate }: UserNavProps) {
  return (
    <div className="user-nav">
      <NavLink to={routes.dictionary} onClick={onNavigate}>
        Dictionary
      </NavLink>
      <NavLink to={routes.recommend} onClick={onNavigate}>
        Recommend
      </NavLink>
      <NavLink to={routes.training} onClick={onNavigate}>
        Training
      </NavLink>
    </div>
  );
}
