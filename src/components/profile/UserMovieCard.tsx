"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiStar, FiTrash2, FiInfo, FiMessageSquare } from "react-icons/fi";
import type { EnrichedUserMovie } from "@/types/EnrichedUserMovie";
import StatusPopover from "@/components/ui/StatusPopover";
import { useTranslations } from "next-intl";

interface UserMovieCardProps {
  item: EnrichedUserMovie;
  locale: string;
  onEdit: (movie: EnrichedUserMovie) => void;
  onDelete: (itemId: number) => void;
  onReview: (movie: EnrichedUserMovie) => void;
  index?: number;
}

/**
 * Carte de film/série utilisateur (sans hover animation ni overlay)
 * Affiche image, titre, note, date + boutons d’action.
 */
export default function UserMovieCard({
  item,
  locale,
  onEdit,
  onDelete,
  onReview,
  index,
}: UserMovieCardProps) {
  const router = useRouter();

  const handleInfo = () => {
    const typePath = item.itemType === "movie" ? "movies" : "series";
    router.push(`/${locale}/${typePath}/${item.itemId}`);
  };

  const tMovies = useTranslations("movies");

  const year = item.release_date
    ? new Date(item.release_date).getFullYear()
    : "—";

  return (
    <div
      className="
        relative bg-slate-900/60 border border-slate-700/40 rounded-2xl 
        overflow-hidden shadow-md transition-all duration-300
        w-full flex flex-col
      "
    >
      {/* --- Image --- */}
      <div className="relative w-full aspect-[2/3] bg-slate-800 flex items-center justify-center">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title}
            fill
            priority={typeof index !== "undefined" && index < 5}
            className="object-cover rounded-t-2xl"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
          />
        ) : (
          <p className="text-slate-500 text-sm sm:text-base px-2 text-center">
            {tMovies("noPoster", { defaultValue: "Aucune image" })}
          </p>
        )}
      </div>

      {/* --- Infos du film --- */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900/80 to-slate-950/90">
        <div>
          <h3 className="text-white font-semibold text-base truncate mb-1">
            {item.title || "Titre inconnu"}
          </h3>

          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{item.vote_average?.toFixed(1) ?? "–"}</span>
            </div>
            <span>{year}</span>
          </div>
        </div>
        {item.status === "completed" ? (
          <div className="flex items-center justify-center mt-4 border-t border-slate-700/40 pt-3">
            <button
              title="Ajouter un avis"
              onClick={() => onReview(item)}
              className="text-green-400 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95 transition-all duration-150 rounded-full p-2 hover:cursor-pointer"
            >
              <FiMessageSquare className="w-5 h-5" />
            </button>
          </div>
        ) : null}

        {/* --- Boutons d’action --- */}
        <div className="flex items-center justify-between mt-4 border-t border-slate-700/40 pt-3">
          <button
            title="Infos"
            onClick={handleInfo}
            className="
              text-blue-400 hover:text-blue-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              active:scale-95 transition-all duration-150 rounded-full p-2 hover:cursor-pointer
            "
          >
            <FiInfo className="w-5 h-5" />
          </button>

          {/* Popover centré */}
          <div className="relative flex-1 flex justify-center">
            <StatusPopover
              currentStatus={item.status}
              onSelect={(newStatus) => onEdit({ ...item, status: newStatus })}
            />
          </div>

          <button
            title="Supprimer"
            onClick={() => onDelete(item.itemId)}
            className="
              text-rose-500 hover:text-rose-400
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              active:scale-95 transition-all duration-150 rounded-full p-2 hover:cursor-pointer
            "
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
