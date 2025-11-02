"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchTmdbDetails } from "@/lib/redux/thunks/tmdbThunks";
import { useUserMovies } from "@/hooks/useUserMovies";
import type { EnrichedUserMovie } from "@/types/EnrichedUserMovie";
import UserMovieCard from "./UserMovieCard";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import ReviewModal from "@/components/ui/ReviewModal";
import UserMovieSearchBar from "@/components/profile/UserMovieSearchBar";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Props {
  status: "watchlist" | "watching" | "completed";
  locale: string;
}

export default function UserMovieListClient({ status, locale }: Props) {
  const t = useTranslations("userMovies.lists");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { lists, loading, deleteUserMovie, updateUserMovie } = useUserMovies();
  const tmdbCache = useAppSelector((s) => s.tmdb.cache);

  const movies = lists[status];
  const [reviewingMovie, setReviewingMovie] =
    useState<EnrichedUserMovie | null>(null);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch TMDB for missing items (don’t cache user fields!)
  useEffect(() => {
    const missing = movies.filter(
      (m) => !tmdbCache[`${m.itemType}_${m.itemId}`]
    );
    if (missing.length === 0) return;

    (async () => {
      try {
        await Promise.all(
          missing.map((m) =>
            dispatch(fetchTmdbDetails(m.itemId, m.itemType, locale))
          )
        );
      } catch (err) {
        console.error("Erreur TMDB :", err);
        toast.error(
          t("tmdbFailed", {
            defaultValue: "Erreur lors du chargement des films TMDB.",
          })
        );
      }
    })();
  }, [movies, tmdbCache, locale, dispatch, t]);

  // Enrich depuis le cache TMDB
  const enrichedMovies = useMemo<EnrichedUserMovie[]>(() => {
    return movies.map((m) => {
      const key = `${m.itemType}_${m.itemId}`;
      const cached = tmdbCache[key];
      return {
        ...m,
        ...(cached ?? {}),
      } as EnrichedUserMovie;
    });
  }, [movies, tmdbCache]);

  const confirmDelete = (itemId: number) => setPendingDelete(itemId);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const ok = await deleteUserMovie(pendingDelete);
    if (ok)
      toast.success(t("deleted", { defaultValue: "Supprimé de la liste" }));
    else
      toast.error(
        t("deleteFailed", { defaultValue: "Erreur lors de la suppression" })
      );
    setPendingDelete(null);
  };

  const handleEdit = async (movie: EnrichedUserMovie) => {
    const ok = await updateUserMovie(movie.itemId, movie.status);
    if (ok) toast.success(t("updated", { defaultValue: "Statut mis à jour" }));
    else
      toast.error(
        t("updateFailed", { defaultValue: "Erreur lors de la mise à jour" })
      );
  };

  const filteredMovies = enrichedMovies.filter((m) =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="min-h-[60vh]">
      {/* Bouton Retour */}
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

      {/* Titre */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-3">
          {t(`${status}.title`)}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          {t(`${status}.description`)}
        </p>
      </div>

      {/* Barre de recherche */}
      <UserMovieSearchBar value={searchQuery} onChange={setSearchQuery} />

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400">
          <div className="w-12 mb-2 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p>{t("loading", { defaultValue: "Chargement..." })}</p>
        </div>
      )}

      {/* Cas vide */}
      {!loading && enrichedMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <p className="text-gray-400 text-lg">
            {t(`${status}.empty`, {
              defaultValue: "Aucun élément dans cette liste.",
            })}
          </p>
        </div>
      )}

      {/* Résultats */}
      {!loading && enrichedMovies.length > 0 && (
        <>
          {filteredMovies.length > 0 ? (
            <div
              className="
                grid grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                gap-5 sm:gap-6 mt-10
              "
            >
              {filteredMovies.map((item, i) => (
                <UserMovieCard
                  key={item._id?.toString() ?? `${item.itemId}-${i}`}
                  item={item}
                  locale={locale}
                  onDelete={() => confirmDelete(item.itemId)}
                  onEdit={handleEdit}
                  onReview={(movie) => setReviewingMovie(movie)}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 mt-10">
              {t("noResult", {
                defaultValue: "Aucun film trouvé pour cette recherche.",
              })}
            </p>
          )}
        </>
      )}

      <ConfirmDeleteModal
        isOpen={pendingDelete !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        title={t("confirmTitle", { defaultValue: "Confirmer la suppression" })}
        message={t("confirmDelete", {
          defaultValue: "Voulez-vous vraiment supprimer cet élément ?",
        })}
      />

      {/* Modal Review */}
      <ReviewModal
        isOpen={!!reviewingMovie}
        onClose={() => setReviewingMovie(null)}
        movieId={reviewingMovie?.itemId ?? 0}
      />
    </section>
  );
}
