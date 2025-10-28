import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ReduxProvider from "@/lib/redux/Provider";
import AuthSync from "@/components/auth/AuthSync";
import { locales, type Locale } from "@/i18n/locales";
import { Toaster } from "react-hot-toast";

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

// --- Variables globales ---
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

/* -------------------------------------------------------------------------- */
/*               MÉTADONNÉES DYNAMIQUES SELON LA LOCALE (SEO)                 */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Vérifie que la locale est valide
  if (!locales.includes(locale as Locale)) notFound();

  // Charge les traductions du namespace "meta"
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s | WatchListy`,
    },
    description: t("description"),
    keywords: (t.raw("keywords") as string[]) || [],
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
      canonical: `/${locale}`,
      languages: {
        "fr-FR": "/fr",
        "en-US": "/en",
      },
    },
    openGraph: {
      title: t("ogTitle") || t("title"),
      description: t("ogDescription") || t("description"),
      url: `${siteUrl}/${locale}`,
      siteName: "WatchListy",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "WatchListy Image",
        },
      ],
    },
    other: { "theme-color": "#7C3AED" },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/watchlisty-icon.svg", sizes: "16x16", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                LAYOUT UI                                   */
/* -------------------------------------------------------------------------- */
export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

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
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AuthSync>
                <Header />
                <main id="content" className="flex-grow pt-10">
                  {children}
                  <Toaster position="top-right" />
                </main>
                <Footer />
              </AuthSync>
            </NextIntlClientProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
