"use client";

import type { ReactNode } from "react";

type PosthogProviderProps = {
  children?: ReactNode;
};

/**
 * Placeholder analytics provider. Wire PostHog or GA here when keys exist.
 */
export function PosthogProvider({ children }: PosthogProviderProps) {
  return children ?? null;
}

