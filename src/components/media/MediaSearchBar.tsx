"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface MediaSearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  type: "movie" | "tv";
}

/**
 * Barre de recherche responsive (films ou séries)
 * - Desktop : icône dans l'input + bouton "Rechercher"
 * - Mobile : icône simple comme bouton
 */
export default function MediaSearchBar({
  value,
  onSearch,
  onClear,
  type,
}: MediaSearchBarProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");
  const [query, setQuery] = useState(value || "");
  const [isMobile, setIsMobile] = useState(false);

  // Synchronisation avec la valeur externe
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Détecte la taille d’écran pour ajuster le style
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex items-center gap-2"
    >
      <div className="relative flex-grow">
        <label htmlFor={`${type}-search`} className="sr-only">
          {t("searchLabel")}
        </label>

        {/* Icône de recherche visible sur desktop */}
        {!isMobile && (
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        )}

        {/* Champ texte */}
        <input
          id={`${type}-search`}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={`
            w-full ${isMobile ? "pl-4" : "pl-12"} pr-10 py-3
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
          `}
        />

        {/* Bouton effacer */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("clearSearch")}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-slate-400
              hover:text-slate-200
              focus:text-slate-100
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              focus-visible:ring-offset-2
              focus-visible:ring-offset-gray-900
              rounded-full
              p-1
              transition-all
              duration-150
              hover:cursor-pointer
            "
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bouton rechercher */}
      <button
        type="submit"
        aria-label={t("searchButton")}
        className={`
          flex items-center justify-center
          ${isMobile ? "w-12 h-12 p-0" : "px-5 py-3 font-medium"}
          rounded-lg
          bg-indigo-600 
          hover:bg-indigo-700 
          text-white 
          transition-all 
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-400 
          focus:ring-offset-2 
          focus:ring-offset-gray-900
          hover:cursor-pointer
        `}
      >
        {isMobile ? <FiSearch className="w-5 h-5" /> : t("searchButton")}
      </button>
    </form>
  );
}
