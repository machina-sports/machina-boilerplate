'use client';

import { useEffect } from 'react';
import { useBrand } from '@/contexts/brand-context';

/**
 * Sync brand color tokens to CSS variables for quick theme swaps.
 */
export function BrandColors() {
  const brand = useBrand();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brand.colors.primary);
    root.style.setProperty('--brand-secondary', brand.colors.secondary);
    root.style.setProperty('--background', brand.colors.background);
    root.style.setProperty('--foreground', brand.colors.foreground);
  }, [brand]);

  return null;
}
