"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MovieHeader from "@/components/movies/detail/MovieHeader";
import MovieOverview from "@/components/movies/detail/MovieOverview";
import MovieCast from "@/components/movies/detail/MovieCast";
import MovieVideos from "@/components/movies/detail/MovieVideos";
import MovieRecommendations from "@/components/movies/detail/MovieRecommendations";
import type { TmdbMovieFull } from "@/types/tmdb";
import MovieReviewsSection from "./MovieReviewsSection";

interface MovieDetailClientProps {
  id: string;
  locale: string;
}

export default function MovieDetailClient({
  id,
  locale,
}: MovieDetailClientProps) {
  const [movie, setMovie] = useState<TmdbMovieFull | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("movies");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const lang = locale === "fr" ? "fr" : "en";
        const res = await fetch(`/api/tmdb/movies/${id}?lang=${lang}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Erreur lors du fetch du film :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id, locale]);

  // --- Loader simple avec spinner animé ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p>{t("loading", { default: "Chargement du film..." })}</p>
      </div>
    );
  }

  // --- Film introuvable / erreur ---
  if (!movie) {
    return (
      <div className="text-center py-16 text-gray-400">
        {t("notFoundMessage", {
          default: "Film introuvable ou erreur de chargement.",
        })}
      </div>
    );
  }

  const { details, credits, videos, recommendations } = movie;

  return (
    <div className="bg-gray-950 text-white pb-12">
      <MovieHeader details={details} locale={locale} />
      <MovieOverview details={details} />
      <MovieVideos videos={videos.results} />
      <MovieCast cast={credits.cast} />
      <MovieReviewsSection movieId={Number(id)} />
      <MovieRecommendations
        recommendations={recommendations.results}
        locale={locale}
      />
    </div>
  );
}
