"use client";

import { useTranslations } from "next-intl";
import { FiPlayCircle, FiTv } from "react-icons/fi";
import type { TmdbVideo } from "@/types/tmdb";

interface MediaVideosProps {
  videos: TmdbVideo[];
  type: "movie" | "tv";
}

/**
 * Affiche les bandes-annonces (films ou séries).
 * Lecture seule — vidéos YouTube uniquement.
 */
export default function MediaVideos({ videos, type }: MediaVideosProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");

  // On garde uniquement les vidéos YouTube valides
  const trailers = videos.filter(
    (v) => v.site === "YouTube" && v.key && v.type === "Trailer"
  );

  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      {/* --- Titre --- */}
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        {type === "movie" ? (
          <FiPlayCircle className="w-5 h-5 text-indigo-400" />
        ) : (
          <FiTv className="w-5 h-5 text-indigo-400" />
        )}
        {t("videos.title", {
          default: type === "movie" ? "Bandes-annonces" : "Vidéos",
        })}
      </h2>

      {/* --- Aucune vidéo --- */}
      {trailers.length === 0 ? (
        <p className="text-gray-400 text-center">
          {t("videos.noVideos", {
            default:
              type === "movie"
                ? "Aucune bande-annonce disponible."
                : "Aucune vidéo disponible.",
          })}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trailers.slice(0, 6).map((video) => (
            <div
              key={video.id}
              className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:shadow-indigo-400/20 transition-all duration-300"
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
