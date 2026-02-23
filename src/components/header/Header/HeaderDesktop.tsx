import { Logo } from "../Logo/Logo";
import { UserNav } from "../UserNav/UserNav";
import { UserBar } from "../UserBar/UserBar";
import styles from "./HeaderDesktop.module.css";

export function HeaderDesktop() {
  return (
    <header className={styles.headerDesktop}>
      <div className={`${styles.headerContainer} container`}>
        <Logo />
        <UserNav />
        <UserBar />
      </div>
    </header>
  );
}
