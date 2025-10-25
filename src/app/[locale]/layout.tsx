import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ReduxProvider from "@/lib/redux/Provider";
import AuthSync from "@/components/auth/AuthSync";
import { locales, type Locale } from "@/i18n/locales";

// --- Font Google ---
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

// --- Génération statique des locales ---
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// --- Metadata (inchangé) ---
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WatchListy | Gestion intelligente de vos films",
    template: "%s | WatchListy",
  },
  description:
    "Organisez, suivez et découvrez vos films et séries préférés avec WatchListy. La solution ultime pour les cinéphiles.",
  keywords: [
    "films",
    "séries",
    "watchlist",
    "cinéma",
    "organisation",
    "suivi",
    "application",
    "gestion de films",
  ],
  authors: [{ name: "WatchListy Team", url: siteUrl }],
  creator: "WatchListy",
  publisher: "WatchListy",
  verification: { google: googleVerification },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/fr", "en-US": "/en" },
  },
  openGraph: {
    title: "WatchListy | Gestion intelligente de vos films",
    description:
      "Organisez, suivez et découvrez vos films et séries préférés avec WatchListy.",
    url: siteUrl,
    siteName: "WatchListy",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WatchListy - Organisez vos films et séries",
      },
    ],
  },
  other: { "theme-color": "#7C3AED" },
  icons: {
    icon: [
      { url: "/watchlisty-icon.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

// --- Layout localisé ---
export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Messages typés via `getMessages()` (de next-intl)
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>

      <body
        className={`${montserrat.className} antialiased min-h-dvh bg-gray-900 text-gray-100`}
      >
        <ReduxProvider>
          <AuthProvider>
            <AuthSync>
              <NextIntlClientProvider locale={locale} messages={messages}>
                <Header />
                <main id="content" className="flex-grow pt-10">
                  {children}
                </main>
                <Footer />
              </NextIntlClientProvider>
            </AuthSync>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
