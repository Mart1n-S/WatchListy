"use client";

import { useTranslations } from "next-intl";
import { FiGlobe, FiInfo, FiFilm } from "react-icons/fi";
import type { TmdbMovieDetails } from "@/types/tmdb";

interface MovieOverviewProps {
  details: TmdbMovieDetails;
}

export default function MovieOverview({ details }: MovieOverviewProps) {
  const t = useTranslations("movies");

  return (
    <section className="mt-10 max-w-5xl mx-auto px-4">
      {/* --- Titre de section --- */}
      <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
        <FiFilm className="w-5 h-5 text-indigo-400" />
        {t("overview.title")}
      </h2>

      {/* --- Synopsis --- */}
      <p className="text-gray-300 leading-relaxed mb-6">
        {details.overview || t("overview.noDescription")}
      </p>

      {/* --- Informations techniques --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <FiGlobe className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-gray-200">
            {t("overview.originalLanguage")}:
          </span>
          <span className="uppercase">{details.original_language}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiInfo className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-gray-200">
            {t("overview.status")}:
          </span>
          <span>
            {t(`overview.statusValues.${details.status}`, {
              default: details.status,
            })}
          </span>
        </div>
      </div>
    </section>
  );
}
