"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { FiCalendar, FiFilm, FiTv } from "react-icons/fi";
import { useAppSelector } from "@/lib/redux/hooks";
import type { Genre } from "@/lib/redux/slices/genresSlice";
import type { UserMovie } from "@/models/UserMovie";
import MediaCard from "@/components/media/MediaCard";

interface PublicProfileClientProps {
  pseudo: string;
}

interface PublicUser {
  pseudo: string;
  avatar?: string | null;
  created_at?: string | null;
  preferences?: {
    movies?: number[];
    tv?: number[];
  };
}

interface PublicLists {
  watchlist: UserMovie[];
  watching: UserMovie[];
  completed: UserMovie[];
}

interface PublicProfileResponse {
  user: PublicUser;
  lists: PublicLists;
}

/** Structure minimale renvoyée par /api/tmdb/[type]/[id] */
interface TmdbDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export default function PublicProfileClient({
  pseudo,
}: PublicProfileClientProps) {
  const t = useTranslations("publicProfile");
  const locale = useLocale() as string;
  const genres = useAppSelector((state) => state.genres);

  const [data, setData] = useState<PublicProfileResponse | null>(null);
  const [mediaCache, setMediaCache] = useState<Record<string, TmdbDetails>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Récupère le nom du genre à partir de son ID */
  const getGenreName = (id: number, type: "movie" | "tv"): string => {
    const list: Genre[] = type === "movie" ? genres.movies : genres.tv;
    return list.find((g) => g.id === id)?.name || t("errors.unknownGenre");
  };

  /** Charge les détails TMDB depuis ton API backend */
  const loadMediaDetails = useCallback(
    async (items: UserMovie[]): Promise<void> => {
      const details: Record<string, TmdbDetails> = {};

      for (const item of items) {
        const key = `${item.itemType}_${item.itemId}`;
        try {
          const res = await fetch(
            `/api/tmdb/${item.itemType}/${item.itemId}?lang=${locale}`
          );

          if (!res.ok) continue;

          const data = await res.json();
          const detail = data.details as TmdbDetails;

          details[key] = {
            id: detail.id,
            title: detail.title ?? detail.name ?? "—",
            name: detail.name ?? detail.title ?? "—",
            overview: detail.overview ?? t("noDescription"),
            poster_path: detail.poster_path ?? null,
            release_date: detail.release_date,
            first_air_date: detail.first_air_date,
            vote_average: detail.vote_average ?? 0,
          };
        } catch (err) {
          console.warn(`Erreur chargement TMDB ${key}:`, err);
        }
      }

      setMediaCache(details);
    },
    [locale, t]
  );

  /** Charge le profil public */
  useEffect(() => {
    async function fetchProfile() {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`/api/users/${pseudo}`);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

        const data: PublicProfileResponse = await res.json();
        setData(data);

        const allItems: UserMovie[] = [
          ...data.lists.watchlist,
          ...data.lists.watching,
          ...data.lists.completed,
        ];

        await loadMediaDetails(allItems);
      } catch (err) {
        console.error("Erreur chargement profil public :", err);
        setError(t("errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [pseudo, t, loadMediaDetails]);

  // --- État de chargement ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p>{t("loading")}</p>
      </div>
    );
  }

  // --- Erreur ou pas de données ---
  if (error || !data) {
    return (
      <div className="text-center text-red-400 py-12">
        {error ?? t("errors.notFound")}
      </div>
    );
  }

  const { user, lists } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-white">
      {/* --- Header --- */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src={`/images/avatars/${user.avatar || "default.png"}`}
          alt={user.pseudo}
          width={100}
          height={100}
          className="rounded-full shadow-md mb-4 object-cover border border-slate-700"
        />
        <h1 className="text-3xl font-bold">{user.pseudo}</h1>
        {user.created_at && (
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
            <FiCalendar className="w-4 h-4" />
            {new Date(user.created_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* --- Préférences --- */}
      {(user.preferences?.movies?.length || user.preferences?.tv?.length) && (
        <div className="mb-8 space-y-6">
          {user.preferences?.movies?.length ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiFilm className="text-indigo-400 w-5 h-5" />
                <h2 className="text-indigo-300 font-semibold">
                  {t("preferences.movies")}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.movies.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600/50 transition-colors"
                  >
                    {getGenreName(id, "movie")}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {user.preferences?.tv?.length ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiTv className="text-purple-400 w-5 h-5" />
                <h2 className="text-purple-300 font-semibold">
                  {t("preferences.tv")}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.preferences.tv.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:bg-purple-600/50 transition-colors"
                  >
                    {getGenreName(id, "tv")}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* --- Listes Watchlist / Watching / Completed --- */}
      <div className="space-y-10">
        {(Object.entries(lists) as [keyof PublicLists, UserMovie[]][]).map(
          ([key, items]) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {t(`lists.${key}`)}
              </h3>
              {items.length === 0 ? (
                <p className="text-gray-500">{t("lists.empty")}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const media = mediaCache[`${item.itemType}_${item.itemId}`];
                    if (!media) return null;
                    return (
                      <MediaCard
                        key={`${item.itemType}_${item.itemId}`}
                        item={media}
                        locale={locale}
                        type={item.itemType}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
