import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/providers/provider';
import { BrandProvider } from '@/contexts/brand-context';
import { BrandColors } from '@/components/brand/brand-colors';
import { getBrandConfig } from '@/config/brands';
import { generateBrandMetadata } from '@/lib/metadata';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const brandId = process.env.NEXT_PUBLIC_BRAND ?? 'default';
const brand = getBrandConfig(brandId);
const { metadata, viewport } = generateBrandMetadata(brand);

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang={brand.language} data-brand={brandId}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BrandProvider brandId={brandId}>
          <BrandColors />
          <Providers>{children}</Providers>
        </BrandProvider>
      </body>
    </html>
  );
}
