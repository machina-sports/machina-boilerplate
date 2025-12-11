'use client';

import type { ReactNode } from 'react';

type SessionProviderProps = {
  children: ReactNode;
};

/**
 * Placeholder session provider. Replace with real auth/session logic (e.g., NextAuth, custom tokens).
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return children;
}
