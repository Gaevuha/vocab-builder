import { Logo } from "../Logo/Logo";
import { UserNav } from "../UserNav/UserNav";
import { UserBar } from "../UserBar/UserBar";

export function HeaderDesktop() {
  return (
    <header className="app-header app-header--desktop">
      <Logo />
      <nav className="app-nav">
        <UserNav />
        <UserBar />
      </nav>
    </header>
  );
}
