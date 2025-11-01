import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import UserMovieListClient from "@/components/profile/UserMovieListClient";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

type Status = "watchlist" | "watching" | "completed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; status: Status }>;
}): Promise<Metadata> {
  const { locale, status } = await params;
  const t = await getTranslations({ locale, namespace: "userMovies.lists" });

  // Sécurité : fallback si un statut invalide est passé dans l'URL
  const safeStatus: Status =
    status === "watchlist" || status === "watching" || status === "completed"
      ? status
      : "watchlist";

  return {
    title: t(`${safeStatus}.title`),
    description: t(`${safeStatus}.description`),
  };
}

export default async function UserMovieListPage({
  params,
}: {
  params: Promise<{ locale: string; status: Status }>;
}) {
  const { locale, status } = await params;

  const safeStatus: Status =
    status === "watchlist" || status === "watching" || status === "completed"
      ? status
      : "watchlist";

  return (
    <div className="min-h-screen relative">
      <BackgroundCinematic />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* On passe bien locale ET status */}
        <UserMovieListClient status={safeStatus} locale={locale} />
      </div>
    </div>
  );
}
