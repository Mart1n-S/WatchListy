"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MediaHeader from "@/components/media/detail/MediaHeader";
import MediaOverview from "@/components/media/detail/MediaOverview";
import MediaCast from "@/components/media/detail/MediaCast";
import MediaVideos from "@/components/media/detail/MediaVideos";
import MediaRecommendations from "@/components/media/detail/MediaRecommendations";
import MediaReviewsSection from "@/components/media/detail/MediaReviewsSection";
import type { TmdbMovieFull, TmdbTvFull } from "@/types/tmdb";

interface MediaDetailClientProps {
  id: string;
  locale: string;
  type: "movie" | "tv";
}

/**
 * Composant client pour afficher le détail d’un film ou d’une série.
 * Gère chargement, erreur et rendu complet du contenu.
 */
export default function MediaDetailClient({
  id,
  locale,
  type,
}: MediaDetailClientProps) {
  const [media, setMedia] = useState<TmdbMovieFull | TmdbTvFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations(type === "movie" ? "movies" : "series");

  useEffect(() => {
    async function fetchMedia() {
      try {
        setError(null);
        setLoading(true);
        const lang = locale === "fr" ? "fr" : "en";

        const res = await fetch(`/api/tmdb/${type}/${id}?lang=${lang}`);
        if (!res.ok) throw new Error(`Échec du chargement TMDB pour ${type}`);

        const data = await res.json();
        setMedia(data);
      } catch (err) {
        console.error(`Erreur lors du chargement du ${type}:`, err);
        setError(
          t("errorFetchingDetail", {
            default:
              type === "movie"
                ? "Erreur lors du chargement du film."
                : "Erreur lors du chargement de la série.",
          })
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [id, locale, type, t]);

  // --- Loader ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p>
          {t("loadingDetail", {
            default:
              type === "movie"
                ? "Chargement du film..."
                : "Chargement de la série...",
          })}
        </p>
      </div>
    );
  }

  // --- Erreur / non trouvé ---
  if (error || !media) {
    return (
      <div className="text-center py-16 text-gray-400">
        {error ??
          t("notFoundMessage", {
            default:
              type === "movie"
                ? "Film introuvable ou erreur de chargement."
                : "Série introuvable ou erreur de chargement.",
          })}
      </div>
    );
  }

  const { details, credits, videos, recommendations } = media;

  return (
    <div className="bg-gray-950 text-white pb-12">
      <MediaHeader details={details} locale={locale} type={type} />
      <MediaOverview details={details} type={type} />
      <MediaVideos videos={videos.results} type={type} />
      <MediaCast cast={credits.cast} type={type} />
      <MediaReviewsSection mediaId={Number(id)} type={type} />
      <MediaRecommendations
        recommendations={recommendations.results}
        locale={locale}
        type={type}
      />
    </div>
  );
}
