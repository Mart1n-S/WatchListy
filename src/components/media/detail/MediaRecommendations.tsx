"use client";

import { useTranslations } from "next-intl";
import { FiThumbsUp, FiTv } from "react-icons/fi";
import MediaGrid from "@/components/media/MediaGrid";
import type { TmdbRecommendation } from "@/types/tmdb";

interface MediaRecommendationsProps {
  recommendations: TmdbRecommendation[];
  locale: string;
  type: "movie" | "tv";
}

/**
 * Affiche les recommandations TMDB (films ou séries similaires)
 */
export default function MediaRecommendations({
  recommendations,
  locale,
  type,
}: MediaRecommendationsProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");

  if (!recommendations?.length) return null;

  // On uniformise et on garantit que "title" existe toujours
  const formattedRecommendations = recommendations.map((rec) => ({
    id: rec.id,
    title: rec.title || rec.name || "Sans titre",
    poster_path: rec.poster_path ?? null,
    release_date: rec.release_date || rec.first_air_date || "",
    vote_average: rec.vote_average ?? 0,
    overview: rec.overview ?? "",
  }));

  return (
    <section className="mt-14 max-w-6xl mx-auto px-4">
      {/* --- Titre --- */}
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        {type === "movie" ? (
          <FiThumbsUp className="w-5 h-5 text-indigo-400" />
        ) : (
          <FiTv className="w-5 h-5 text-indigo-400" />
        )}
        {t("recommendations.title", {
          default:
            type === "movie" ? "Films similaires" : "Séries recommandées",
        })}
      </h2>

      {/* --- Grille des médias --- */}
      <MediaGrid items={formattedRecommendations} locale={locale} type={type} />
    </section>
  );
}
