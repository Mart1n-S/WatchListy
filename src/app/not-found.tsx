import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { locales, type Locale, defaultLocale } from "@/i18n/locales";

/* -------------------------------------------------------------------------- */
/*                         MÉTADONNÉES DYNAMIQUES SEO                         */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const resolvedParams = params ? await params : undefined;
  let locale = resolvedParams?.locale;

  // fallback : déduire la locale depuis le referer ou l'URL
  if (!locale) {
    const hdrs = await headers();
    const referer = hdrs.get("referer") || "";
    const match = referer.match(/\/(fr|en)(\/|$)/);
    locale = match?.[1] || defaultLocale;
  }

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "notFound",
  });

  return {
    title: `404 | ${t("title")}`,
    description: t("description"),
    robots: { index: false, follow: false },
    openGraph: {
      title: `404 | ${t("title")}`,
      description: t("description"),
      type: "website",
    },
    icons: {
      icon: "/watchlisty-icon.svg",
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                 PAGE 404                                   */
/* -------------------------------------------------------------------------- */
export default async function NotFoundPage({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  let locale = resolvedParams?.locale;

  if (!locale) {
    const hdrs = await headers();
    const referer = hdrs.get("referer") || "";
    const match = referer.match(/\/(fr|en)(\/|$)/);
    locale = match?.[1] || defaultLocale;
  }

  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "notFound",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-6xl font-bold text-violet-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-100 mb-3">
        {t("title")}
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">{t("description")}</p>

      <Link
        href={`/${locale}`}
        className="w-full sm:w-auto inline-flex justify-center px-6 py-3 rounded-lg bg-violet-600 text-white
                   hover:bg-violet-500 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:ring-offset-2 focus:ring-offset-gray-800
                   hover:cursor-pointer"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
