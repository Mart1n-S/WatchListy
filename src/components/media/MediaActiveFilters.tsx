"use client";

import {
  FiFilm,
  FiGlobe,
  FiStar,
  FiArrowDown,
  FiArrowUp,
  FiX,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface MediaActiveFiltersProps {
  filters: Record<string, string>;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  getGenreName: (id: string) => string;
  type: "movie" | "tv";
}

/**
 * Affiche les filtres actifs (films ou séries) sous forme de tags cliquables animés.
 */
export default function MediaActiveFilters({
  filters,
  onClearFilter,
  onClearAll,
  getGenreName,
  type,
}: MediaActiveFiltersProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");

  const activeEntries = Object.entries(filters).filter(([, v]) => v);
  if (activeEntries.length === 0) return null;

  /** Génère un label lisible pour le tri */
  const getSortLabel = (value: string) => {
    switch (value) {
      case "popularity.desc":
        return (
          <>
            <FiArrowUp className="inline w-4 h-4 mr-1" />
            {t("filters.sort.popularityLabel")}
          </>
        );
      case "popularity.asc":
        return (
          <>
            <FiArrowDown className="inline w-4 h-4 mr-1" />
            {t("filters.sort.popularityLabel")}
          </>
        );
      case "vote_average.desc":
        return (
          <>
            <FiArrowDown className="inline w-4 h-4 mr-1" />
            {t("filters.sort.ratingLabel")}
          </>
        );
      case "vote_average.asc":
        return (
          <>
            <FiArrowUp className="inline w-4 h-4 mr-1" />
            {t("filters.sort.ratingLabel")}
          </>
        );
      case "release_date.desc":
      case "first_air_date.desc":
        return (
          <>
            <FiArrowDown className="inline w-4 h-4 mr-1" />
            {t("filters.sort.dateLabel")}
          </>
        );
      case "release_date.asc":
      case "first_air_date.asc":
        return (
          <>
            <FiArrowUp className="inline w-4 h-4 mr-1" />
            {t("filters.sort.dateLabel")}
          </>
        );
      default:
        return value;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-2 mb-6">
      <AnimatePresence>
        {activeEntries.map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            layout
            className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-400/30 text-indigo-200 px-3 py-1.5 rounded-full text-sm"
          >
            <span className="flex items-center gap-1">
              {key === "with_genres" && <FiFilm className="w-4 h-4" />}
              {key === "with_original_language" && (
                <FiGlobe className="w-4 h-4" />
              )}
              {key === "vote_average_gte" && <FiStar className="w-4 h-4" />}

              <span>
                {key === "with_genres"
                  ? getGenreName(value)
                  : key === "with_original_language"
                  ? value.toUpperCase()
                  : key === "vote_average_gte"
                  ? `${value}+`
                  : key === "sort_by"
                  ? getSortLabel(value)
                  : `${key}: ${value}`}
              </span>
            </span>

            {/* Bouton supprimer un filtre */}
            <button
              onClick={() => onClearFilter(key)}
              aria-label={t("filters.removeFilter")}
              className="
                text-indigo-300
                hover:text-white
                focus:text-indigo-200
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-400
                focus-visible:ring-offset-2
                focus-visible:ring-offset-slate-900
                rounded-full
                p-1
                transition-all
                duration-200
                hover:cursor-pointer
              "
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bouton tout effacer */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClearAll}
        className="
          text-slate-400 text-sm
          hover:text-red-400
          focus:text-red-300
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-400
          focus-visible:ring-offset-2
          focus-visible:ring-offset-slate-900
          rounded-md
          transition-all
          duration-200
          ml-2
          px-2
          hover:cursor-pointer
        "
      >
        {t("filters.clearAll")}
      </motion.button>
    </div>
  );
}
