import type { Metadata, Viewport } from "next";
import "./globals.css";
import { VisitorPresence } from "@/components/visitor-presence";
import { BRAND_COPYRIGHT, BRAND_OWNER, BRAND_PROVENANCE_ID } from "@/lib/brand-integrity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: BRAND_OWNER,
  title: "FRIES GLOBAL | Your sourcing team in China",
  description: "China-side product sourcing, supplier coordination, quality control and export execution for global buyers.",
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
  authors: [{ name: BRAND_OWNER }],
  creator: BRAND_OWNER,
  publisher: BRAND_OWNER,
  other: {
    copyright: BRAND_COPYRIGHT,
    "brand-provenance": BRAND_PROVENANCE_ID,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-brand-provenance={BRAND_PROVENANCE_ID}>
      <body data-copyright-owner={BRAND_OWNER}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <VisitorPresence />
      </body>
    </html>
  );
}
