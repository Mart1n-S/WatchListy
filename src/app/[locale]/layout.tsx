import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { HtmlLangUpdater } from "@/components/utils/HtmlLangUpdater";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ReduxProvider from "@/lib/redux/Provider";
import AuthSync from "@/components/auth/AuthSync";
import { locales, type Locale } from "@/i18n/locales";
import { Toaster } from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/*                 GÉNÉRATION STATIQUE DES PARAMÈTRES DE LOCALE               */
/* -------------------------------------------------------------------------- */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* -------------------------------------------------------------------------- */
/*                         MÉTADONNÉES DYNAMIQUES                             */
/* -------------------------------------------------------------------------- */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

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
    title: { default: t("title"), template: `%s | WatchListy` },
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
      languages: { "fr-FR": "/fr", "en-US": "/en" },
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
/*                               LAYOUT LOCALISÉ                              */
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
    <ReduxProvider>
      <AuthProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthSync>
            <HtmlLangUpdater locale={locale} />

            <Suspense
              fallback={
                <div className="flex justify-center items-center py-4 text-gray-400">
                  Chargement du header...
                </div>
              }
            >
              <Header />
            </Suspense>

            <main id="content" className="flex-grow pt-10">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Chargement...</p>
                  </div>
                }
              >
                {children}
              </Suspense>

              <Toaster position="top-right" />
            </main>

            <Footer />
          </AuthSync>
        </NextIntlClientProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
