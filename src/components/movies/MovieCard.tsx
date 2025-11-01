"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
  };
  locale: string;
  priority?: boolean;
}

/**
 * Carte visuelle pour un film.
 * - Affiche le poster, le titre, la note et la date de sortie.
 * - Clic redirige vers la page détail du film (/movies/[id])
 */
export default function MovieCard({
  movie,
  locale,
  priority = false,
}: MovieCardProps) {
  const router = useRouter();
  const t = useTranslations("movies");

  const handleClick = () => {
    router.push(`/${locale}/movies/${movie.id}`);
  };

  // Added keyboard accessibility to handle 'Enter' key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "—";

  return (
    <motion.div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="
        relative bg-slate-900/60 border border-slate-700/40 rounded-2xl overflow-hidden shadow-md hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer group w-full
        focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
      "
      tabIndex={0}
    >
      {/* --- Poster --- */}
      <div className="relative w-full aspect-[2/3] bg-slate-800 flex items-center justify-center">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            priority={priority}
            className="object-cover rounded-t-2xl group-hover:brightness-110 transition-all duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
          />
        ) : (
          <p className="text-slate-500 text-sm sm:text-base">{t("noPoster")}</p>
        )}
      </div>

      {/* --- Infos du film --- */}
      <div className="p-4 bg-gradient-to-b from-slate-900/80 to-slate-950/90">
        <h3 className="text-white font-semibold text-base truncate">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-slate-400 text-sm mt-2">
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <span>{year}</span>
        </div>
      </div>

      {/* --- Overlay synopsis au survol --- */}
      <div
        className="
          absolute inset-0 bg-slate-950/95 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center p-4
        "
      >
        <p className="text-slate-300 text-sm line-clamp-6 leading-relaxed">
          {movie.overview || t("noDescription")}
        </p>
      </div>
    </motion.div>
  );
}
