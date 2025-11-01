"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";

import MediaSearchBar from "./MediaSearchBar";
import MediaFilters from "./MediaFilters";
import MediaGrid from "./MediaGrid";
import MediaActiveFilters from "./MediaActiveFilters";
import MediaPagination from "./MediaPagination";

interface Media {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
}

interface MediaListClientProps {
  locale: string;
  type: "movie" | "tv";
}

/**
 * Composant principal pour les pages de films et séries.
 * Gère recherche, filtres, pagination et affichage.
 */
export default function MediaListClient({
  locale,
  type,
}: MediaListClientProps) {
  const t = useTranslations(type === "movie" ? "movies" : "series");
  const router = useRouter();
  const searchParams = useSearchParams();

  const language: "fr" | "en" = locale === "fr" ? "fr" : "en";

  // Genres selon type
  const genres = useAppSelector((state) =>
    type === "movie" ? state.genres.movies : state.genres.tv
  );

  // --- États ---
  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Utils ---
  const getGenreName = (id: string) => {
    const genre = genres.find((g) => g.id === Number(id));
    return genre ? genre.name : id;
  };

  // --- Fetchers ---

  /** Populaires */
  const fetchPopular = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tmdb/${type}/popular?lang=${language}&page=${pageNumber}`
        );
        if (!res.ok) throw new Error(`Erreur API TMDB: ${res.status}`);
        const data = await res.json();
        setItems(data.results ?? []);
        setTotal(data.total_pages ?? 1);
      } catch (err) {
        console.error("Erreur fetchPopular :", err);
        setError(t("errorFetching", { defaultValue: "Erreur de chargement." }));
      } finally {
        setLoading(false);
      }
    },
    [type, language, t]
  );

  /** Recherche */
  const fetchSearch = useCallback(
    async (searchTerm: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tmdb/${type}/search?query=${encodeURIComponent(
            searchTerm
          )}&lang=${language}`
        );
        if (!res.ok) throw new Error(`Erreur API TMDB Search: ${res.status}`);
        const data = await res.json();
        setItems(data.results ?? []);
        setTotal(data.total_pages ?? 1);
        setPage(1);
      } catch (err) {
        console.error("Erreur fetchSearch :", err);
        setError(t("errorFetching", { defaultValue: "Erreur de recherche." }));
      } finally {
        setLoading(false);
      }
    },
    [type, language, t]
  );

  /** Discover (filtres) */
  const fetchDiscover = useCallback(
    async (pageNumber = 1, activeFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          lang: language,
          page: String(pageNumber),
        });
        for (const [key, value] of Object.entries(activeFilters)) {
          if (value) params.append(key, value);
        }

        const res = await fetch(
          `/api/tmdb/${type}/discover?${params.toString()}`
        );
        if (!res.ok) throw new Error(`Erreur API TMDB Discover: ${res.status}`);
        const data = await res.json();
        setItems(data.results ?? []);
        setTotal(data.total_pages ?? 1);
      } catch (err) {
        console.error("Erreur fetchDiscover :", err);
        setError(t("errorFetching", { defaultValue: "Erreur de filtrage." }));
      } finally {
        setLoading(false);
      }
    },
    [filters, language, t, type]
  );

  // --- Handlers ---
  /** Recherche */
  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setPage(1);
    const params = new URLSearchParams();
    if (searchTerm.trim() !== "") params.set("query", searchTerm);
    router.push(`?${params.toString()}`);
    if (searchTerm.trim() === "") fetchPopular(1);
    else fetchSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setQuery("");
    // Reconstruit l'URL selon les filtres existants
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    router.push(`?${params.toString()}`);
    // Recharge selon contexte
    if (Object.keys(filters).length > 0) fetchDiscover(1, filters);
    else fetchPopular(1);
  };

  /** Changement de filtres */
  const handleFilterChange = (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => {
    setFilters(updater);
    setPage(1);
  };

  /** Pagination */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    if (query.trim() !== "") fetchSearch(query);
    else if (Object.values(filters).some((v) => v))
      fetchDiscover(newPage, filters);
    else fetchPopular(newPage);
  };

  /** Supprime un filtre spécifique */
  const handleClearFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  /** Supprime tous les filtres */
  const handleClearAll = () => {
    setFilters({});
  };

  // --- EFFETS ---

  /** Met à jour l'URL quand les filtres OU la recherche changent */
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  }, [filters, query, router]);

  /** Synchronise l'URL et recharge quand des filtres sont actifs */
  useEffect(() => {
    const hasFilters = Object.keys(filters).length > 0;
    if (!hasFilters) return;

    const params = new URLSearchParams();
    if (query) params.set("query", query);
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    router.push(`?${params.toString()}`);

    setQuery("");
    fetchDiscover(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /** Déclenche un nouvel appel quand les filtres changent (sécurité double) */
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setQuery("");
      fetchDiscover(1, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /** Populaires si pas de recherche ni filtres */
  useEffect(() => {
    if (!query && Object.keys(filters).length === 0) fetchPopular(1);
  }, [fetchPopular, query, filters]);

  /** Recharge les résultats si une query est présente */
  useEffect(() => {
    if (query && query.trim() !== "") {
      fetchSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /** Restaure depuis l’URL au montage */
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const filterKeys = [
      "with_genres",
      "vote_average_gte",
      "with_original_language",
      "sort_by",
    ];
    const restoredFilters: Record<string, string> = {};
    for (const key of filterKeys) {
      if (params[key]) restoredFilters[key] = params[key];
    }
    if (params.query) setQuery(params.query);
    if (params.page) setPage(Number(params.page));
    if (Object.keys(restoredFilters).length > 0) setFilters(restoredFilters);

    // Recharge selon les params trouvés
    if (params.query) fetchSearch(params.query);
    else if (Object.keys(restoredFilters).length > 0)
      fetchDiscover(Number(params.page) || 1, restoredFilters);
    else fetchPopular(Number(params.page) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Rendu ---
  return (
    <div className="text-white">
      <MediaSearchBar
        value={query}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        type={type}
      />

      {/* Filtres uniquement si pas de recherche */}
      <AnimatePresence>
        {!query && (
          <motion.div
            key="filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MediaFilters
              filters={filters}
              onChange={handleFilterChange}
              type={type}
            />

            <MediaActiveFilters
              filters={filters}
              onClearFilter={handleClearFilter}
              onClearAll={handleClearAll}
              getGenreName={getGenreName}
              type={type}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loader / Erreur / Grille */}
      {loading && (
        <p className="text-slate-400 text-center mt-10 animate-pulse">
          {t("loading", { defaultValue: "Chargement..." })}
        </p>
      )}
      {!loading && error && (
        <p className="text-red-400 text-center mt-10">{error}</p>
      )}
      {!loading && !error && items.length > 0 && (
        <MediaGrid items={items} locale={locale} type={type} />
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-slate-400 text-center mt-10">
          {t("noResults", { defaultValue: "Aucun résultat trouvé." })}
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <MediaPagination
          page={page}
          totalPages={total}
          onPageChange={handlePageChange}
          type={type}
        />
      )}
    </div>
  );
}
