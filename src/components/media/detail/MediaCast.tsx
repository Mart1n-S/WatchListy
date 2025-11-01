"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FiUsers, FiTv } from "react-icons/fi";
import type { TmdbCredit } from "@/types/tmdb";

interface MediaCastProps {
  cast: TmdbCredit[];
  type: "movie" | "tv";
}

/**
 * Affiche la distribution (acteurs principaux)
 * Compatible avec les films et les séries.
 */
export default function MediaCast({ cast, type }: MediaCastProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");

  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      {/* --- Titre --- */}
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        {type === "movie" ? (
          <FiUsers className="w-5 h-5 text-indigo-400" />
        ) : (
          <FiTv className="w-5 h-5 text-indigo-400" />
        )}
        {t("cast.title", {
          default: type === "movie" ? "Distribution" : "Casting principal",
        })}
      </h2>

      {cast.length === 0 ? (
        <p className="text-gray-400 text-center">
          {t("cast.noCast", { default: "Aucun acteur disponible." })}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {cast.slice(0, 12).map((actor) => (
            <div
              key={actor.id}
              className="text-center bg-gray-900/30 rounded-lg p-3 hover:bg-gray-800/50 transition-all duration-200"
            >
              {actor.profile_path ? (
                <div className="relative w-full aspect-[2/3] mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    fill
                    sizes="(max-width: 640px) 50vw,
                           (max-width: 1024px) 33vw,
                           16vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-2">
                  {t("cast.noImage", { default: "Aucune image" })}
                </div>
              )}

              <p className="text-gray-200 font-medium leading-tight text-sm">
                {actor.name}
              </p>

              {actor.character && (
                <p className="text-gray-400 text-xs italic truncate">
                  {actor.character}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
