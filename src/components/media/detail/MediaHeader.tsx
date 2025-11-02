"use client";

import Image from "next/image";
import {
  FiCalendar,
  FiClock,
  FiStar,
  FiPlusCircle,
  FiLoader,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useUserMovies } from "@/hooks/useUserMovies";
import type { TmdbMovieDetails, TmdbTvDetails } from "@/types/tmdb";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

interface MediaHeaderProps {
  details: TmdbMovieDetails | TmdbTvDetails;
  locale: string;
  type: "movie" | "tv";
  localRating: number | null;
}

function formatRuntime(minutes?: number | number[]): string | null {
  if (!minutes) return null;
  const totalMinutes = Array.isArray(minutes) ? minutes[0] : minutes;
  if (!totalMinutes) return null;

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return hours > 0
    ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`
    : `${totalMinutes}min`;
}

export default function MediaHeader({
  details,
  locale,
  type,
  localRating,
}: MediaHeaderProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");
  const { movies, addUserMovie } = useUserMovies();
  const [isAdding, setIsAdding] = useState(false);

  const isMovie = type === "movie";

  // Trouve si l’élément est déjà dans la watchlist
  const userEntry = useMemo(
    () => movies.find((m) => m.itemId === details.id && m.itemType === type),
    [movies, details.id, type]
  );

  const buttonLabel = useMemo(() => {
    if (!userEntry)
      return t("addToWatchlist", { defaultValue: "Ajouter à ma Watchlist" });
    switch (userEntry.status) {
      case "watchlist":
        return t("alreadyInWatchlist", {
          defaultValue: "Déjà dans la Watchlist",
        });
      case "watching":
        return t("currentlyWatching", {
          defaultValue: "En cours de visionnage",
        });
      case "completed":
        return t("completed", { defaultValue: "Déjà visionné" });
      default:
        return "Déjà ajouté";
    }
  }, [userEntry, t]);

  const handleAddToWatchlist = async () => {
    try {
      setIsAdding(true);
      const success = await addUserMovie(details.id, type, "watchlist");

      if (success) {
        toast.success(
          t("addedToWatchlist", { defaultValue: "Ajouté à la Watchlist" })
        );
      } else {
        toast.error(
          t("failedToAdd", { defaultValue: "Erreur lors de l’ajout" })
        );
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Champs adaptés au type
  const title = isMovie
    ? (details as TmdbMovieDetails).title
    : (details as TmdbTvDetails).name;
  const tagline = isMovie
    ? (details as TmdbMovieDetails).tagline
    : (details as TmdbTvDetails).tagline;
  const releaseDate = isMovie
    ? (details as TmdbMovieDetails).release_date
    : (details as TmdbTvDetails).first_air_date;
  const runtime = isMovie
    ? (details as TmdbMovieDetails).runtime
    : (details as TmdbTvDetails).episode_run_time?.[0];
  const genres = details.genres ?? [];

  return (
    <section className="relative mb-8">
      {/* --- Backdrop --- */}
      {details.backdrop_path && (
        <div className="relative h-[60vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={title}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      )}

      <div
        className={`max-w-6xl mx-auto px-4 relative z-10 ${
          details.backdrop_path ? "-mt-48" : "mt-10"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Poster --- */}
          {details.poster_path && (
            <div className="w-64 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={title}
                width={500}
                height={750}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          )}

          {/* --- Infos --- */}
          <div className="flex flex-col justify-end">
            <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>

            {tagline && (
              <p className="italic text-gray-400 mb-4">“{tagline}”</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              {/* Date */}
              {releaseDate && (
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>
                    {new Date(releaseDate).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {/* Durée ou nombre d’épisodes */}
              {runtime && (
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{formatRuntime(runtime)}</span>
                </div>
              )}
              {!runtime &&
                !isMovie &&
                (details as TmdbTvDetails).number_of_episodes && (
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>
                      {(details as TmdbTvDetails).number_of_episodes} épisodes
                    </span>
                  </div>
                )}

              {/* Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-yellow-400">
                {/* TMDB */}
                <div className="flex items-center gap-1">
                  <FiStar className="w-4 h-4 fill-yellow-400" />
                  <span>{details.vote_average.toFixed(1)} / 10 TMDB</span>
                </div>

                {/* Watchlisty */}
                {localRating !== null && (
                  <div className="flex items-center gap-1 text-purple-400">
                    <FiStar className="w-4 h-4 fill-purple-400" />
                    <span>{localRating.toFixed(1)} / 10 Watchlisty</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* --- Bouton Watchlist --- */}
            <div className="mt-6">
              <button
                disabled={!!userEntry || isAdding}
                onClick={handleAddToWatchlist}
                className={`w-full px-6 py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2
                  transition-all duration-300 transform
                  shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                  relative overflow-hidden
                  ${
                    userEntry
                      ? "bg-gray-700 cursor-not-allowed opacity-80"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:cursor-pointer"
                  }`}
              >
                {isAdding ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    {t("adding", { defaultValue: "Ajout..." })}
                  </>
                ) : (
                  <>
                    {!userEntry && <FiPlusCircle className="w-5 h-5" />}
                    <span>{buttonLabel}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
