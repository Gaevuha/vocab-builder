import { useState } from "react";
import { Logo } from "../Logo/Logo";
import { UserNav } from "../UserNav/UserNav";
import { UserBar } from "../UserBar/UserBar";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <Logo />
      <nav className={`app-nav ${menuOpen ? "app-nav--open" : ""}`}>
        <UserNav onNavigate={() => setMenuOpen(false)} />
        <UserBar />
      </nav>
      <button
        className="burger"
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Menu"
      >
        ☰
      </button>
    </header>
  );
}
