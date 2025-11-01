"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Contrôles de pagination pour la navigation entre les pages de films.
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("movies");

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      {/* --- Bouton Précédent --- */}
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-xl 
          border border-slate-700/50 
          bg-slate-800/60 
          text-slate-300 
          hover:bg-slate-700/50 
          hover:text-white 
          transition-all 
          duration-200 
          disabled:opacity-50 
          disabled:cursor-not-allowed
        `}
      >
        <FiChevronLeft className="w-4 h-4" />
        <span>{t("previous")}</span>
      </button>

      {/* --- Info de page --- */}
      <span className="text-slate-400 text-sm">
        {t("page")} {page} / {totalPages}
      </span>

      {/* --- Bouton Suivant --- */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-xl 
          border border-slate-700/50 
          bg-slate-800/60 
          text-slate-300 
          hover:bg-slate-700/50 
          hover:text-white 
          transition-all 
          duration-200 
          disabled:opacity-50 
          disabled:cursor-not-allowed hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
        `}
      >
        <span>{t("next")}</span>
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
