import { createContext, useContext, useEffect, useState } from "react";

// Slider position (1-4) -> size multiplier.
export const TEXT_SCALE = { 1: 0.85, 2: 1, 3: 1.15, 4: 1.3 };
const KEY = "mediscan_text_size";

const PrefsContext = createContext(null);

export function PrefsProvider({ children }) {
  const [textSize, setTextSize] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return TEXT_SCALE[saved] ? saved : "2";
    } catch {
      return "2";
    }
  });

  // Tailwind sizes text, spacing, and widths in rem, so changing the root font size
  // resizes every page at once, including the sign-in screens.
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (TEXT_SCALE[textSize] || 1)}px`;
    try {
      localStorage.setItem(KEY, textSize);
    } catch {}
  }, [textSize]);

  return <PrefsContext.Provider value={{ textSize, setTextSize }}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);
