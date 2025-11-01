import { getTranslations } from "next-intl/server";
import MediaDetailClient from "@/components/media/detail/MediaDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "series" });

  return {
    title: t("pageTitle", { default: "Séries" }),
    description: t("noOverview", { default: "Aucune description disponible." }),
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  return (
    <div className="min-h-screen pt-[36px] bg-gray-950 text-white pb-12">
      <MediaDetailClient id={id} locale={locale} type="tv" />
    </div>
  );
}
