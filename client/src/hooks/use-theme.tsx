import { useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

type Theme = "light" | "dark";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return [theme, toggleTheme];
}
