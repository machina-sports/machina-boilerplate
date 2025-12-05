import type { Metadata, Viewport } from "next";
import type { BrandConfig } from "@/config/brands";

export const generateBrandMetadata = (
  brand: BrandConfig,
): { metadata: Metadata; viewport: Viewport } => {
  const metadata: Metadata = {
    title: brand.content.title,
    description: brand.content.description,
    icons: {
      icon: brand.content.favicon,
    },
    openGraph: {
      title: brand.content.title,
      description: brand.content.description,
      images: brand.content.ogImage ? [brand.content.ogImage] : undefined,
    },
  };

  const viewport: Viewport = {
    themeColor: `hsl(${brand.colors.primary})`,
  };

  return { metadata, viewport };
};

