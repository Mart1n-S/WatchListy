"use client";

import MovieCard from "./MovieCard";
import { useTranslations } from "next-intl";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieGridProps {
  movies: Movie[];
  locale: string;
}

/**
 * Grille responsive de cartes de films.
 */
export default function MovieGrid({ movies, locale }: MovieGridProps) {
  const t = useTranslations("movies");

  if (!movies || movies.length === 0) {
    return <p className="text-slate-400 text-center mt-10">{t("noMovies")}</p>;
  }

  return (
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
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          locale={locale}
          priority={index < 5}
        />
      ))}
    </div>
  );
}
