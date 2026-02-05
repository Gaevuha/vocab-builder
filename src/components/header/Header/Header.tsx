import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { HeaderDesktop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";

export function Header() {
  const { isDesktop } = useBreakpoint();

  return isDesktop ? <HeaderDesktop /> : <HeaderMobile />;
}
