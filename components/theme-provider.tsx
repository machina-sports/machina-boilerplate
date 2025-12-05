"use client";

import { useEffect, type ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: "dark" | "light";
};

/**
 * Minimal theme provider placeholder. Extend with next-themes or design-system
 * tokens when integrating a full theming solution.
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme ?? defaultTheme;
  }, [defaultTheme]);

  return children;
}

