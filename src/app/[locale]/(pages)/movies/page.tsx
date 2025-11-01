import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MoviesClient from "@/components/movies/MoviesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "movies.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function MoviesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <MoviesClient
        initialMovies={[]}
        initialPage={1}
        totalPages={1}
        locale={locale}
      />
    </div>
  );
}
