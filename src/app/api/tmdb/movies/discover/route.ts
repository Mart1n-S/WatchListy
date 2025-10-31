export const dynamic = "force-dynamic";
export const revalidate = 3600;

import { NextResponse } from "next/server";

const TMDB_BASE = process.env.TMDB_API_BASE!;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

// === Types ===
interface TmdbMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
}

interface TmdbDiscoverResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: TmdbMovie[];
}

/**
 * Endpoint interne pour rechercher des films avec filtres avancés.
 * Ex : /api/tmdb/movies/discover?lang=fr&page=1&with_genres=28&sort_by=vote_average.desc
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const lang = searchParams.get("lang") || "fr";
        const page = searchParams.get("page") || "1";

        // Construction dynamique des filtres
        const params = new URLSearchParams({
            language: lang === "fr" ? "fr-FR" : "en-US",
            include_adult: "false",
            page,
        });

        // Filtres optionnels
        const withGenres = searchParams.get("with_genres");
        const sortBy = searchParams.get("sort_by");
        const withOriginalLanguage = searchParams.get("with_original_language");
        const voteAverageGte = searchParams.get("vote_average_gte");
        const region = searchParams.get("region");

        if (withGenres) params.append("with_genres", withGenres);
        if (sortBy) params.append("sort_by", sortBy);
        if (withOriginalLanguage)
            params.append("with_original_language", withOriginalLanguage);
        if (voteAverageGte) params.append("vote_average.gte", voteAverageGte);
        if (region) params.append("region", region);

        // --- Appel à TMDB ---
        const response = await fetch(`${TMDB_BASE}/discover/movie?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
                Accept: "application/json",
            },
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error("TMDB Discover Error:", await response.text());
            throw new Error("Erreur lors de la récupération des films TMDB");
        }

        const data: TmdbDiscoverResponse = await response.json();

        // Réponse typée + cache HTTP
        return NextResponse.json(
            {
                ...data,
                fetchedAt: new Date().toISOString(),
                cached: true,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
                },
            }
        );
    } catch (error) {
        console.error("Erreur TMDB (discover):", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
