export const dynamic = "force-dynamic";
export const revalidate = 3600;

import { NextResponse } from "next/server";

const TMDB_BASE = process.env.TMDB_API_BASE!;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

interface TmdbMedia {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
}

interface TmdbDiscoverResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: TmdbMedia[];
}

/**
 * GET /api/tmdb/[type]/discover?lang=fr&page=1&with_genres=18
 * type ∈ ["movie", "tv"]
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ type: string }> }
) {
    try {
        const { type } = await context.params;
        if (type !== "movie" && type !== "tv") {
            return NextResponse.json(
                { error: "Type invalide. Attendu: movie ou tv" },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);
        const lang = searchParams.get("lang") || "fr";
        const page = searchParams.get("page") || "1";
        const language = lang === "fr" ? "fr-FR" : "en-US";

        const params = new URLSearchParams({
            language,
            include_adult: "false",
            page,
        });

        const allowedKeys = [
            "with_genres",
            "sort_by",
            "with_original_language",
            "vote_average_gte",
            "region",
        ];

        for (const [key, value] of searchParams.entries()) {
            if (allowedKeys.includes(key) && value) params.append(key, value);
        }

        const response = await fetch(
            `${TMDB_BASE}/discover/${type}?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            console.error("TMDB Discover Error:", await response.text());
            throw new Error("Erreur TMDB Discover");
        }

        const data: TmdbDiscoverResponse = await response.json();

        const results = data.results.map((m) => ({
            id: m.id,
            title: m.title || m.name,
            overview: m.overview,
            poster_path: m.poster_path,
            release_date: m.release_date || m.first_air_date,
            vote_average: m.vote_average,
        }));

        return NextResponse.json(
            { ...data, results, fetchedAt: new Date().toISOString() },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
                },
            }
        );
    } catch (error) {
        console.error("Erreur TMDB (discover):", error);
        return NextResponse.json(
            { error: "Erreur interne serveur" },
            { status: 500 }
        );
    }
}
