"use client";

import type { ReactNode } from "react";

type DataProviderProps = {
  children: ReactNode;
};

/**
 * Placeholder data provider (projects/docs loaders, redirects, etc.).
 * Extend with real data fetching and caching once APIs are ready.
 */
export function DataProvider({ children }: DataProviderProps) {
  return children;
}

