import { Logo } from "../Logo/Logo";
import { UserNav } from "../UserNav/UserNav";
import { UserBar } from "../UserBar/UserBar";
import styles from "./HeaderDesktop.module.css";

export function HeaderDesktop() {
  return (
    <header className={`${styles.headerDesktop} container`}>
      <Logo />
      <UserNav />
      <UserBar />
    </header>
  );
}
