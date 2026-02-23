import { useEffect, useState } from "react";

const desktopQuery = "(min-width: 1440px)";
const tabletQuery = "(min-width: 768px) and (max-width: 1439px)";
const mobileQuery = "(max-width: 767px)";

function getMatches(query: string) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

export function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(getMatches(desktopQuery));
  const [isTablet, setIsTablet] = useState(getMatches(tabletQuery));
  const [isMobile, setIsMobile] = useState(getMatches(mobileQuery));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktopMedia = window.matchMedia(desktopQuery);
    const tabletMedia = window.matchMedia(tabletQuery);
    const mobileMedia = window.matchMedia(mobileQuery);

    const update = () => {
      setIsDesktop(desktopMedia.matches);
      setIsTablet(tabletMedia.matches);
      setIsMobile(mobileMedia.matches);
    };

    update();

    desktopMedia.addEventListener("change", update);
    tabletMedia.addEventListener("change", update);
    mobileMedia.addEventListener("change", update);

    return () => {
      desktopMedia.removeEventListener("change", update);
      tabletMedia.removeEventListener("change", update);
      mobileMedia.removeEventListener("change", update);
    };
  }, []);

  return {
    isDesktop,
    isTablet,
    isMobile,
  };
}
