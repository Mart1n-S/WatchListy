"use client";

import { useTranslations } from "next-intl";
import { FiGlobe, FiInfo, FiFilm, FiTv } from "react-icons/fi";
import type { TmdbMovieDetails, TmdbTvDetails } from "@/types/tmdb";

interface MediaOverviewProps {
  details: TmdbMovieDetails | TmdbTvDetails;
  type: "movie" | "tv";
}

/**
 * Affiche le synopsis + quelques infos techniques.
 * Compatible avec films et séries.
 */
export default function MediaOverview({ details, type }: MediaOverviewProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");

  const isMovie = type === "movie";

  const overview = details.overview || t("overview.noDescription");
  const originalLang = details.original_language?.toUpperCase() ?? "–";
  const status = details.status || "Unknown";

  return (
    <section className="mt-10 max-w-5xl mx-auto px-4">
      {/* --- Titre de section --- */}
      <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
        {isMovie ? (
          <FiFilm className="w-5 h-5 text-indigo-400" />
        ) : (
          <FiTv className="w-5 h-5 text-indigo-400" />
        )}
        {t("overview.title", {
          default: isMovie ? "Synopsis du film" : "Synopsis de la série",
        })}
      </h2>

      {/* --- Synopsis --- */}
      <p className="text-gray-300 leading-relaxed mb-6">{overview}</p>

      {/* --- Informations techniques --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <FiGlobe className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-gray-200">
            {t("overview.originalLanguage", { default: "Langue originale" })}:
          </span>
          <span className="uppercase">{originalLang}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiInfo className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-gray-200">
            {t("overview.status", { default: "Statut" })}:
          </span>
          <span>
            {t(`overview.statusValues.${status}`, { default: status })}
          </span>
        </div>

        {/* --- Info spécifique aux séries --- */}
        {!isMovie && (
          <>
            <div className="flex items-center gap-2">
              <FiTv className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-gray-200">
                {t("overview.numberOfSeasons", { default: "Saisons" })}:
              </span>
              <span>{(details as TmdbTvDetails).number_of_seasons ?? "–"}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiFilm className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-gray-200">
                {t("overview.numberOfEpisodes", { default: "Épisodes" })}:
              </span>
              <span>
                {(details as TmdbTvDetails).number_of_episodes ?? "–"}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
