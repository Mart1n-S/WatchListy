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
}

interface TmdbResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: TmdbMovie[];
}

/**
 * Endpoint interne pour récupérer les films populaires depuis TMDB.
 * Exemple : /api/tmdb/movies/popular?lang=fr&page=2
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get("lang") || "fr"; // Langue du site (fr / en)
        const page = searchParams.get("page") || "1"; // Pagination TMDB (1–500)

        // Conversion en format TMDB
        const language = lang === "fr" ? "fr-FR" : "en-US";

        // --- Appel à TMDB ---
        const response = await fetch(
            `${TMDB_BASE}/movie/popular?language=${language}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            console.error("TMDB Popular Error:", await response.text());
            throw new Error("Erreur lors de la récupération des films populaires TMDB");
        }

        const data: TmdbResponse = await response.json();

        // --- Réponse propre et typée ---
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
        console.error("Erreur TMDB (popular):", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
