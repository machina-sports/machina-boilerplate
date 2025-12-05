"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getBrandConfig, type BrandConfig } from "@/config/brands";

const BrandContext = createContext<BrandConfig>(getBrandConfig());

type BrandProviderProps = {
  brandId?: string;
  children: ReactNode;
};

export function BrandProvider({ brandId, children }: BrandProviderProps) {
  const brand = useMemo(() => getBrandConfig(brandId), [brandId]);

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export const useBrand = () => useContext(BrandContext);

