import { useEffect, useState } from "react";

/** A mouse or trackpad (not touch) — the only devices that get cursor effects. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** Client-side media query. Always false during server rendering and the first client render. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
