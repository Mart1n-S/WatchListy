"use client";

import Image from "next/image";
import { FiCalendar, FiClock, FiStar } from "react-icons/fi";
import type { TmdbMovieDetails } from "@/types/tmdb";

interface MovieHeaderProps {
  details: TmdbMovieDetails;
  locale: string;
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`;
  }

  return `${minutes}min`;
}

export default function MovieHeader({ details, locale }: MovieHeaderProps) {
  return (
    <section className="relative mb-8">
      {/* --- Backdrop (image de fond) --- */}
      {details.backdrop_path && (
        <div className="relative h-[60vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Poster --- */}
          {details.poster_path && (
            <div className="w-64 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.title}
                width={500}
                height={750}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          )}

          {/* --- Informations principales --- */}
          <div className="flex flex-col justify-end">
            <h1 className="text-3xl font-bold mb-2">{details.title}</h1>

            {details.tagline && (
              <p className="italic text-gray-400 mb-4">“{details.tagline}”</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              {/* Date */}
              {details.release_date && (
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>
                    {new Date(details.release_date).toLocaleDateString(locale)}
                  </span>
                </div>
              )}

              {/* Durée */}
              {details.runtime && (
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{formatRuntime(details.runtime)}</span>
                </div>
              )}

              {/* Note */}
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-yellow-400" />
                <span>{details.vote_average.toFixed(1)} / 10</span>
              </div>
            </div>

            {/* Genres */}
            {details.genres?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {details.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
