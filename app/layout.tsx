import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { readJson } from "@/lib/fs";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff5a00",
};

export const metadata: Metadata = {
  title: {
    default: "Shree Nivi Buildtech | PEB & Structural Steel Infrastructure",
    template: "%s | Shree Nivi Buildtech"
  },
  description: "25+ Years of Excellence in Pre-Engineered Buildings (PEB), Steel Structures, and Heavy Industrial Fabrication. Engineering solid foundations for tomorrow.",
  keywords: [
    "Pre Engineered Buildings",
    "PEB India",
    "Steel Structures",
    "Industrial Fabrication",
    "Warehouse Construction",
    "Factory Buildings",
    "Cold Storage Construction",
    "Industrial Sheds",
    "Heavy Steel Structures",
    "Shree Nivi Buildtech"
  ],
  authors: [{ name: "Shree Nivi Buildtech" }],
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Shree Nivi Buildtech | PEB & Structural Steel Infrastructure",
    description: "25+ Years of Excellence in Pre-Engineered Buildings, Steel Structures, and Heavy Industrial Fabrication.",
    url: "https://shreenivibuildtech.com",
    siteName: "Shree Nivi Buildtech",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shree Nivi Buildtech Steel Structures"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await readJson<any>('settings.json', {
    logoText: 'SHREE NIVI BUILDTECH',
    logoUrl: '',
    faviconUrl: '/favicon.ico',
    loaderUrl: '',
    footerDescription: 'Leading the steel construction sector for over 25 years. We design, fabricate, and erect high-grade pre-engineered buildings and heavy industrial structures.',
    copyrightText: '© 2026 Shree Nivi Buildtech. All rights reserved.'
  });

  const heroSettings = await readJson<any>('hero.json', {
    logoText: '',
    logoUrl: '',
  } as any);

  const activeLogoText = heroSettings.logoText || settings.logoText;
  const activeLogoUrl = heroSettings.logoUrl || settings.logoUrl;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased bg-white dark:bg-[#08090d] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          {/* Main website header */}
          <Navbar logoText={activeLogoText} logoUrl={activeLogoUrl} />
          
          {/* Page content wrapper */}
          <main className="flex-grow w-full relative">
            {children}
          </main>

          {/* Main website footer */}
          <Footer
            logoText={activeLogoText}
            logoUrl={activeLogoUrl}
            footerDescription={settings.footerDescription}
            copyrightText={settings.copyrightText}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
