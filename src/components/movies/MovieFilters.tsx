"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/redux/hooks";
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface MovieFiltersProps {
  filters: Record<string, string>;
  onChange: (
    update: (prev: Record<string, string>) => Record<string, string>
  ) => void;
}

export default function MovieFilters({ filters, onChange }: MovieFiltersProps) {
  const t = useTranslations("movies");
  const genres = useAppSelector((state) => state.genres.movies);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (key: string, value: string) => {
    onChange((prev) => ({
      ...prev,
      [key]: value || "",
    }));
  };

  const baseInputClass = `
    bg-gray-800
    border border-gray-700
    rounded-lg
    text-gray-100
    placeholder-gray-500
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    focus:ring-offset-2
    focus:ring-offset-gray-900
    hover:border-gray-600
  `;

  const shouldShowFilters = isDesktop || isOpen;

  return (
    <div className="mt-6 mb-8 text-sm">
      {/* --- Bouton Mobile --- */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="
            flex items-center gap-2
            px-4 py-2
            bg-indigo-600/20 border border-indigo-500/40
            text-indigo-200 rounded-lg
            hover:bg-indigo-600/30
            transition-all
            focus:outline-none
            focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900
          "
        >
          <FiFilter className="w-5 h-5" />
          {t("filters.title")}
          {isOpen ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* --- Contenu des filtres (desktop + mobile) --- */}
      {isClient && (
        <AnimatePresence initial={false}>
          {shouldShowFilters && (
            <motion.div
              key="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden p-1"
            >
              <div className="flex flex-wrap gap-6 text-sm">
                {/* --- Genre --- */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label htmlFor="genre" className="text-slate-300 font-medium">
                    {t("filters.genre")}
                  </label>
                  <select
                    id="genre"
                    className={`${baseInputClass} px-4 py-2 hover:cursor-pointer`}
                    value={filters.with_genres ?? ""}
                    onChange={(e) =>
                      handleChange("with_genres", e.target.value)
                    }
                  >
                    <option value="">{t("filters.allGenres")}</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- Langue --- */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label
                    htmlFor="language"
                    className="text-slate-300 font-medium"
                  >
                    {t("filters.language")}
                  </label>
                  <select
                    id="language"
                    className={`${baseInputClass} px-4 py-2 hover:cursor-pointer`}
                    value={filters.with_original_language ?? ""}
                    onChange={(e) =>
                      handleChange("with_original_language", e.target.value)
                    }
                  >
                    <option value="">{t("filters.allLanguages")}</option>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="ja">Japonais</option>
                    <option value="ko">Coréen</option>
                  </select>
                </div>

                {/* --- Note minimale --- */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label
                    htmlFor="minRating"
                    className="text-slate-300 font-medium"
                  >
                    {t("filters.minRating")}
                  </label>
                  <select
                    id="minRating"
                    className={`${baseInputClass} px-4 py-2 w-36 hover:cursor-pointer`}
                    value={filters.vote_average_gte ?? ""}
                    onChange={(e) =>
                      handleChange("vote_average_gte", e.target.value)
                    }
                  >
                    <option value="">{t("filters.anyRating")}</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- Tri --- */}
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label
                    htmlFor="sortBy"
                    className="text-slate-300 font-medium"
                  >
                    {t("filters.sort.label")}
                  </label>
                  <select
                    id="sortBy"
                    className={`${baseInputClass} px-4 py-2 hover:cursor-pointer`}
                    value={filters.sort_by ?? "popularity.desc"}
                    onChange={(e) => handleChange("sort_by", e.target.value)}
                  >
                    <option value="popularity.desc">
                      🔥 {t("filters.sort.popularityDesc")}
                    </option>
                    <option value="popularity.asc">
                      🧊 {t("filters.sort.popularityAsc")}
                    </option>
                    <option value="vote_average.desc">
                      🔽 {t("filters.sort.ratingDesc")}
                    </option>
                    <option value="vote_average.asc">
                      🔼 {t("filters.sort.ratingAsc")}
                    </option>
                    <option value="release_date.desc">
                      🕒 {t("filters.sort.dateDesc")}
                    </option>
                    <option value="release_date.asc">
                      ⏳ {t("filters.sort.dateAsc")}
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
