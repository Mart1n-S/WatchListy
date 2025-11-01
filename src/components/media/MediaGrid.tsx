"use client";

import MediaCard from "./MediaCard";
import { useTranslations } from "next-intl";

interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface MediaGridProps {
  items: Media[];
  locale: string;
  type: "movie" | "tv";
}

/**
 * Grille responsive de cartes de médias (films ou séries).
 */
export default function MediaGrid({ items, locale, type }: MediaGridProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");

  if (!items || items.length === 0) {
    return (
      <p className="text-slate-400 text-center mt-10">
        {t("noResults", { defaultValue: "Aucun résultat trouvé." })}
      </p>
    );
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
      {items.map((item, index) => (
        <MediaCard
          key={item.id}
          item={item}
          locale={locale}
          type={type}
          priority={index < 5}
        />
      ))}
    </div>
  );
}
