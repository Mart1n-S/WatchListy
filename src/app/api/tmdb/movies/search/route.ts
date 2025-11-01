export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidation toutes les 1h

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
}

interface TmdbSearchResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: TmdbMovie[];
}

/**
 * Endpoint interne pour rechercher des films sur TMDB.
 * Exemple : /api/tmdb/movies/search?query=inception&lang=fr&page=1
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get("query")?.trim();
        const lang = searchParams.get("lang") || "fr";
        const page = searchParams.get("page") || "1";

        if (!query) {
            return NextResponse.json(
                { error: "Le paramètre 'query' est requis." },
                { status: 400 }
            );
        }

        const language = lang === "fr" ? "fr-FR" : "en-US";

        // --- Appel TMDB /search/movie ---
        const response = await fetch(
            `${TMDB_BASE}/search/movie?query=${encodeURIComponent(
                query
            )}&language=${language}&page=${page}&include_adult=false`,
            {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            console.error("TMDB Search Error:", await response.text());
            throw new Error("Erreur lors de la recherche de films TMDB");
        }

        const data: TmdbSearchResponse = await response.json();

        const formattedResults: TmdbMovie[] = data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            popularity: movie.popularity,
        }));

        return NextResponse.json(
            {
                query,
                page: data.page,
                total_pages: data.total_pages,
                total_results: data.total_results,
                results: formattedResults,
                language,
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
        console.error("Erreur TMDB (search):", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
