"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  /** Valeur du champ de recherche */
  value: string;

  /** Callback appelée à chaque changement de texte */
  onChange: (query: string) => void;

  /** Placeholder personnalisé */
  placeholder?: string;

  /** Couleur principale du focus ring (ex: "indigo" ou "rose") */
  accentColor?: string;

  /** Largeur max (optionnelle, par défaut `max-w-lg`) */
  maxWidthClass?: string;
}

/**
 * SearchBar
 * Composant générique de barre de recherche (frontend-only)
 * Réutilisable pour filtrer tout type de liste (films, users, etc.)
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  accentColor = "indigo",
  maxWidthClass = "max-w-lg",
}: SearchBarProps) {
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
    <div className={`w-full ${maxWidthClass} mx-auto mb-8 relative`}>
      {/* Icône loupe (desktop uniquement) */}
      {!isMobile && (
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
          aria-hidden="true"
        />
      )}

      {/* Champ texte */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full ${isMobile ? "pl-4" : "pl-12"} pr-10 py-3
          bg-slate-900 border border-slate-700 rounded-lg
          text-gray-100 placeholder-gray-500
          transition-colors
          focus:outline-none focus:ring-2
          focus:ring-${accentColor}-500
          focus:ring-offset-2 focus:ring-offset-gray-900
          hover:border-slate-600
        `}
      />

      {/* Bouton effacer */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Effacer"
          className={`
            absolute right-3 top-1/2 -translate-y-1/2
            text-slate-400 hover:text-slate-200 rounded-full p-1
            focus:outline-none focus:ring-2
            focus:ring-${accentColor}-500
            focus:ring-offset-2 focus:ring-offset-gray-900
          `}
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
