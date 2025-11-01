import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MediaListClient from "@/components/media/MediaListClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "series.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <MediaListClient locale={locale} type="tv" />
    </div>
  );
}
