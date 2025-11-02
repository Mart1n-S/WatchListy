"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FiEdit3 } from "react-icons/fi";

interface StatusPopoverProps {
  currentStatus: "watchlist" | "watching" | "completed";
  onSelect: (newStatus: "watchlist" | "watching" | "completed") => void;
}

export default function StatusPopover({
  currentStatus,
  onSelect,
}: StatusPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("userMovies.status");

  // Fermer le menu en cliquant à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const STATUSES: ("watchlist" | "watching" | "completed")[] = [
    "watchlist",
    "watching",
    "completed",
  ];

  return (
    <div ref={popoverRef} className="relative">
      {/* --- Bouton principal --- */}
      <button
        title={t("edit")}
        onClick={() => setOpen((p) => !p)}
        className="
          text-amber-400 hover:text-amber-300
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60
          focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
          rounded-full p-2 transition hover:cursor-pointer
        "
      >
        <FiEdit3 className="w-5 h-5" />
      </button>

      {/* --- Popover --- */}
      {open && (
        <div
          className="
      absolute bottom-12 left-1/2 -translate-x-1/2 w-36
      bg-slate-800 border border-slate-700
      rounded-lg shadow-xl
      overflow-hidden animate-popover-slide z-0
    "
        >
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => {
                if (status !== currentStatus) {
                  onSelect(status);
                  setOpen(false);
                }
              }}
              disabled={status === currentStatus}
              className={`w-full text-left px-3 py-2 text-sm transition
      ${
        currentStatus === status
          ? "bg-slate-700 text-amber-400 font-semibold cursor-not-allowed opacity-75"
          : "text-gray-300 hover:bg-slate-700 hover:text-amber-300 cursor-pointer"
      }`}
            >
              {t(status)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
