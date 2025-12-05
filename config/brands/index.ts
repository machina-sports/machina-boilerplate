export type BrandConfig = {
  id: string;
  language: string;
  content: {
    title: string;
    description: string;
    favicon?: string;
    ogImage?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  analytics?: {
    ga4Primary?: string;
    ga4Secondary?: string;
  };
};

const brands: Record<string, BrandConfig> = {
  default: {
    id: "default",
    language: "en-US",
    content: {
      title: "Machina Frontend",
      description: "Next.js + Redux + Tailwind boilerplate for new projects.",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
    colors: {
      primary: "207 95% 41%",
      secondary: "207 95% 50%",
      background: "0 0% 7%",
      foreground: "0 0% 100%",
    },
  },
  sportingbet: {
    id: "sportingbet",
    language: "en-US",
    content: {
      title: "Sportingbet Companion",
      description: "Assistive experience with content, odds, and recommendations.",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
    colors: {
      primary: "207 95% 41%",
      secondary: "207 95% 50%",
      background: "220 100% 8%",
      foreground: "0 0% 100%",
    },
  },
};

export const getBrandConfig = (brandId?: string) => {
  const key = brandId ?? process.env.NEXT_PUBLIC_BRAND ?? "default";
  return brands[key] ?? brands.default;
};

export const brandList = Object.values(brands);

