"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface UserMovieSearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

/**
 * Barre de recherche pour filtrer les films de la liste utilisateur (frontend only)
 */
export default function UserMovieSearchBar({
  value,
  onChange,
}: UserMovieSearchBarProps) {
  const t = useTranslations("userMovies.search");
  const [query, setQuery] = useState(value || "");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setQuery(value || ""), [value]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClear = () => {
    setQuery("");
    onChange("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8 relative">
      {/* Icône loupe (desktop) */}
      {!isMobile && (
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      )}

      {/* Champ texte */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={t("placeholder", {
          defaultValue: "Rechercher un film ou une série...",
        })}
        className={`
          w-full ${isMobile ? "pl-4" : "pl-12"} pr-10 py-3
          bg-slate-900 border border-slate-700 rounded-lg
          text-gray-100 placeholder-gray-500
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:ring-offset-2 focus:ring-offset-gray-900
          hover:border-slate-600
        `}
      />

      {/* Bouton effacer */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t("clear", { defaultValue: "Effacer" })}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-slate-400 hover:text-slate-200 rounded-full p-1
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
