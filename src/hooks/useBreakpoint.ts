import { useEffect, useState } from "react";

const desktopQuery = "(min-width: 1440px)";
const tabletQuery = "(min-width: 768px)";

function getMatches(query: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
}

export function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(getMatches(desktopQuery));
  const [isTablet, setIsTablet] = useState(getMatches(tabletQuery));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktopMedia = window.matchMedia(desktopQuery);
    const tabletMedia = window.matchMedia(tabletQuery);

    const update = () => {
      setIsDesktop(desktopMedia.matches);
      setIsTablet(tabletMedia.matches);
    };

    update();

    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener("change", update);
      tabletMedia.addEventListener("change", update);
    } else {
      desktopMedia.addListener(update);
      tabletMedia.addListener(update);
    }

    return () => {
      if (desktopMedia.removeEventListener) {
        desktopMedia.removeEventListener("change", update);
        tabletMedia.removeEventListener("change", update);
      } else {
        desktopMedia.removeListener(update);
        tabletMedia.removeListener(update);
      }
    };
  }, []);

  return {
    isDesktop,
    isTablet,
    isMobile: !isTablet,
  };
}
