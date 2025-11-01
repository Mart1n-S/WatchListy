"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useUserMovies } from "@/hooks/useUserMovies";
import type { UserMovie } from "@/models/UserMovie";
import type { EnrichedUserMovie } from "@/types/EnrichedUserMovie";
import UserMovieCard from "./UserMovieCard";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Props {
  status: "watchlist" | "watching" | "completed";
  locale: string;
}

export default function UserMovieListClient({ status, locale }: Props) {
  const t = useTranslations("userMovies.lists");
  const { lists, loading, deleteUserMovie } = useUserMovies();
  const [enrichedMovies, setEnrichedMovies] = useState<EnrichedUserMovie[]>([]);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const movies: UserMovie[] = lists[status];
  const router = useRouter();

  // --- Fetch des infos TMDB pour enrichir les films de la liste ---
  useEffect(() => {
    async function fetchMovieDetails() {
      if (!movies || movies.length === 0) {
        setEnrichedMovies([]);
        return;
      }

      try {
        const enriched = await Promise.all(
          movies.map(async (m) => {
            const res = await fetch(
              `/api/tmdb/${m.itemType}/${m.itemId}?lang=${locale}`
            );
            if (!res.ok) return m as EnrichedUserMovie;
            const data = await res.json();

            return {
              ...m,
              title: data.details.title || data.details.name,
              poster_path: data.details.poster_path,
              release_date:
                data.details.release_date || data.details.first_air_date,
              vote_average: data.details.vote_average,
            } as EnrichedUserMovie;
          })
        );

        setEnrichedMovies(enriched);
      } catch (err) {
        console.error("Erreur lors du fetch des détails TMDB :", err);
        toast.error("Erreur lors du chargement des films TMDB.");
      }
    }

    fetchMovieDetails();
  }, [movies, locale]);

  // --- Gestion de la suppression ---
  const confirmDelete = (itemId: number) => {
    setPendingDelete(itemId);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    const success = await deleteUserMovie(pendingDelete);
    if (success) {
      toast.success(t("deleted", { defaultValue: "Supprimé de la liste" }));
      setEnrichedMovies((prev) =>
        prev.filter((m) => m.itemId !== pendingDelete)
      );
    } else {
      toast.error(
        t("deleteFailed", {
          defaultValue: "Erreur lors de la suppression",
        })
      );
    }

    setPendingDelete(null);
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
  };

  // --- Gestion du changement de statut ---
  const handleEdit = async (movie: EnrichedUserMovie) => {
    try {
      const res = await fetch(`/api/user-movies/${movie.itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: movie.status }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }

      // Retirer l’élément si son statut ne correspond plus à la page actuelle
      setEnrichedMovies((prev) =>
        prev.filter((m) => m.itemId !== movie.itemId)
      );

      toast.success(t("updated", { defaultValue: "Statut mis à jour" }));
    } catch (err) {
      console.error(err);
      toast.error(
        t("updateFailed", { defaultValue: "Erreur lors de la mise à jour" })
      );
    }
  };

  // --- Rendu principal ---
  return (
    <section className="min-h-[60vh]">
      {/* --- Bouton Retour au Profil --- */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/${locale}/profile`)}
          title={t("back", { defaultValue: "Retour" })}
          className="
            flex items-center justify-center w-12 h-12 
            rounded-full bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-500 hover:to-purple-500 text-white font-semibold
            transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95]
            shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
            hover:cursor-pointer
          "
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* --- Titre et description --- */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-3">
          {t(`${status}.title`)}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          {t(`${status}.description`)}
        </p>
      </div>

      {/* --- Loader --- */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400">
          <div className="w-12 mb-2 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p>{t("loading", { defaultValue: "Chargement..." })}</p>
        </div>
      )}

      {/* --- Cas vide --- */}
      {!loading && enrichedMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <p className="text-gray-400 text-lg">
            {t(`${status}.empty`, {
              defaultValue: "Aucun élément dans cette liste.",
            })}
          </p>
        </div>
      )}

      {/* --- Grille des films --- */}
      {enrichedMovies.length > 0 && (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-5
            sm:gap-6
            mt-10
          "
        >
          {enrichedMovies.map((item, i) => (
            <UserMovieCard
              key={item._id?.toString() ?? `${item.itemId}-${i}`}
              item={item}
              locale={locale}
              onDelete={() => confirmDelete(item.itemId)}
              onEdit={handleEdit}
              index={i}
            />
          ))}
        </div>
      )}

      {/* --- Modal de confirmation de suppression --- */}
      <ConfirmDeleteModal
        isOpen={pendingDelete !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title={t("confirmTitle", { defaultValue: "Confirmer la suppression" })}
        message={t("confirmDelete", {
          defaultValue: "Voulez-vous vraiment supprimer cet élément ?",
        })}
      />
    </section>
  );
}
