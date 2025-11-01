import { getTranslations } from "next-intl/server";
import MovieDetailClient from "@/components/movies/detail/MovieDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "movies" });

  return {
    title: t("pageTitle", { default: "Films" }),
    description: t("noOverview", { default: "Aucune description disponible." }),
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  return (
    <div className="min-h-screen pt-[36px] bg-gray-950 text-white pb-12">
      <MovieDetailClient id={id} locale={locale} />
    </div>
  );
}
