'use client';

import type { ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Theme boundary for future dark/light/system toggles.
 * Wire up next-themes or design-system providers here.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return children;
}
