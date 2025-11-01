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
import type { TmdbMovieDetails } from "@/types/tmdb";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

interface MovieHeaderProps {
  details: TmdbMovieDetails;
  locale: string;
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`;
  }

  return `${minutes}min`;
}

export default function MovieHeader({ details, locale }: MovieHeaderProps) {
  const t = useTranslations("movies");
  const { movies, addUserMovie } = useUserMovies();
  const [isAdding, setIsAdding] = useState(false);

  const userEntry = useMemo(
    () => movies.find((m) => m.itemId === details.id && m.itemType === "movie"),
    [movies, details.id]
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
      const success = await addUserMovie(details.id, "movie", "watchlist");

      if (success) {
        toast.success(
          t("addedToWatchlist", { defaultValue: "Ajouté à la Watchlist ✅" })
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

  return (
    <section className="relative mb-8">
      {/* --- Backdrop --- */}
      {details.backdrop_path && (
        <div className="relative h-[60vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Poster --- */}
          {details.poster_path && (
            <div className="w-64 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.title}
                width={500}
                height={750}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          )}

          {/* --- Infos --- */}
          <div className="flex flex-col justify-end">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {details.title}
            </h1>

            {details.tagline && (
              <p className="italic text-gray-400 mb-4">“{details.tagline}”</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              {/* Date */}
              {details.release_date && (
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>
                    {new Date(details.release_date).toLocaleDateString(locale)}
                  </span>
                </div>
              )}

              {/* Durée */}
              {details.runtime && (
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{formatRuntime(details.runtime)}</span>
                </div>
              )}

              {/* Note */}
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-yellow-400" />
                <span>{details.vote_average.toFixed(1)} / 10</span>
              </div>
            </div>

            {/* Genres */}
            {details.genres?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {details.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* --- Bouton --- */}
            <div className="mt-6">
              <button
                disabled={!!userEntry || isAdding}
                onClick={handleAddToWatchlist}
                className={`
                  w-full px-6 py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2
                  transition-all duration-300 transform
                  shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                  relative overflow-hidden
                  ${
                    userEntry
                      ? "bg-gray-700 cursor-not-allowed opacity-80"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:cursor-pointer"
                  }
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
