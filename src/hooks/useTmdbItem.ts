"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { TmdbItemDetails } from "@/types/tmdb";

interface TmdbItem {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
}

/**
 * Hook pour récupérer les informations d’un film ou d’une série depuis TMDB.
 */
export function useTmdbItem(itemId: number, itemType: "movie" | "tv") {
    const [data, setData] = useState<TmdbItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();

    useEffect(() => {
        async function fetchItem() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/tmdb/${itemType}/${itemId}?lang=${locale}`);
                if (!res.ok) throw new Error("Failed to fetch TMDB data");

                const json = await res.json();
                const details = json.details as TmdbItemDetails;

                setData({
                    id: details.id,
                    title: details.title ?? details.name ?? "—",
                    poster_path: details.poster_path ?? null,
                    release_date: details.release_date ?? details.first_air_date ?? "—",
                    vote_average: details.vote_average ?? 0,
                });
            } catch (err) {
                console.error("Erreur useTmdbItem:", err);
                setError("common.errors.internalServerError");
            } finally {
                setLoading(false);
            }
        }

        fetchItem();
    }, [itemId, itemType, locale]);

    return { data, loading, error };
}
