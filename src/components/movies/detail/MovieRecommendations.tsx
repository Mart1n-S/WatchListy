"use client";

import { useTranslations } from "next-intl";
import { FiThumbsUp } from "react-icons/fi";
import MovieGrid from "@/components/movies/MovieGrid";
import { TmdbRecommendation } from "@/types/tmdb";

interface MovieRecommendationsProps {
  recommendations: TmdbRecommendation[];
  locale: string;
}

export default function MovieRecommendations({
  recommendations,
  locale,
}: MovieRecommendationsProps) {
  const t = useTranslations("movies");

  if (!recommendations?.length) return null;

  // TMDB renvoie parfois des données partielles → on uniformise
  const formattedRecommendations = recommendations.map((rec) => ({
    ...rec,
    vote_average: rec.vote_average ?? 0,
    overview: rec.overview ?? "",
  }));

  return (
    <section className="mt-14 max-w-6xl mx-auto px-4">
      {/* --- Titre --- */}
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FiThumbsUp className="w-5 h-5 text-indigo-400" />
        {t("recommendations.title")}
      </h2>

      {/* --- Grille des films (réutilise MovieGrid) --- */}
      <MovieGrid movies={formattedRecommendations} locale={locale} />
    </section>
  );
}
