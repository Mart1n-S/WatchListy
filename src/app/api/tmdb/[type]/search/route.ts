export const dynamic = "force-dynamic";
export const revalidate = 3600;

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

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

interface TmdbSearchResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: TmdbMedia[];
}

/**
 * GET /api/tmdb/[type]/search?query=breaking+bad&lang=fr
 * type ∈ ["movie", "tv"]
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ type: string }> }
) {
    // --- Authentification ---
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
    }
    try {
        const { type } = await context.params;
        if (type !== "movie" && type !== "tv") {
            return NextResponse.json(
                { error: "Type invalide. Attendu: movie ou tv" },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query");
        const lang = searchParams.get("lang") || "fr";
        const language = lang === "fr" ? "fr-FR" : "en-US";

        if (!query) {
            return NextResponse.json(
                { error: "Paramètre 'query' manquant" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${TMDB_BASE}/search/${type}?query=${encodeURIComponent(
                query
            )}&language=${language}&include_adult=false`,
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
            throw new Error("Erreur TMDB Search");
        }

        const data: TmdbSearchResponse = await response.json();

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
        logger.error({
            route: "/api/tmdb/[type]/search",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: "Erreur interne serveur" },
            { status: 500 }
        );
    }
}
