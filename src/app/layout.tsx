import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Inter } from "next/font/google";
import { brand } from "@/lib/brand";
import { absoluteUrl } from "@/lib/utils";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ToastProvider } from "@/components/providers/toast-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { MacroModeProvider } from "@/components/providers/macro-mode-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.nameBare,
  keywords: [
    "high protein meals",
    "shelf stable meals",
    "high protein mac and cheese",
    "instant meals with protein",
    "macro friendly ready meals",
    "dehydrated meals",
    brand.nameBare,
  ],
  authors: [{ name: brand.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortPitch,
    url: absoluteUrl("/"),
    locale: "en_IE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortPitch,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "food",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0c" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <ToastProvider>
          <MacroModeProvider>
            <CartProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-ink"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="main" className="relative">
                {children}
              </main>
              <SiteFooter />
              <CartDrawer />
              <CookieBanner />
            </CartProvider>
          </MacroModeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
