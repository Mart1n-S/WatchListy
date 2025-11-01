"use client";

import { FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title = "Confirmation",
  message = "Voulez-vous vraiment supprimer cet élément ?",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const t = useTranslations("userMovies.lists");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[90%] sm:w-[400px] shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <FiTrash2 className="text-rose-500 w-6 h-6" />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>

        <p className="text-gray-300 mb-6 text-sm">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg text-sm font-medium text-gray-300
              bg-slate-800 hover:bg-slate-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              transition hover:cursor-pointer
            "
          >
            {t("cancelButton")}
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg text-sm font-medium text-white
              bg-rose-600 hover:bg-rose-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              transition hover:cursor-pointer
            "
          >
            {t("deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
