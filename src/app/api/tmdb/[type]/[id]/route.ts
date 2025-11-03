export const dynamic = "force-dynamic";
export const revalidate = 43200; // 12h

import { NextResponse } from "next/server";
import {
    TmdbVideo,
    TmdbRecommendation,
    TmdbMovieFull,
} from "@/types/tmdb";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const TMDB_BASE = process.env.TMDB_API_BASE!;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

/**
 * GET /api/tmdb/[type]/[id]?lang=fr
 * type ∈ ["movie", "tv"]
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ type: string; id: string }> }
) {
    try {
        // --- Authentification ---
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }
        const { type, id } = await context.params;
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get("lang") || "fr";
        const language = lang === "fr" ? "fr-FR" : "en-US";

        if (!id || (type !== "movie" && type !== "tv")) {
            return NextResponse.json(
                { error: "Paramètres invalides. Attendu: /api/tmdb/{movie|tv}/{id}" },
                { status: 400 }
            );
        }

        // --- Appels parallèles à TMDB ---
        const [detailsRes, creditsRes, videosRes, recsRes] = await Promise.all([
            fetch(`${TMDB_BASE}/${type}/${id}?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
            fetch(`${TMDB_BASE}/${type}/${id}/credits?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
            fetch(`${TMDB_BASE}/${type}/${id}/videos?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
            fetch(`${TMDB_BASE}/${type}/${id}/recommendations?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
        ]);

        if (!detailsRes.ok) {
            return NextResponse.json(
                { error: `${type} introuvable sur TMDB.` },
                { status: detailsRes.status }
            );
        }

        // --- Extraction des données ---
        const [details, credits, videos, recommendations] = await Promise.all([
            detailsRes.json(),
            creditsRes.json(),
            videosRes.json(),
            recsRes.json(),
        ]);

        // --- Filtrage typé des vidéos ---
        const filteredVideos: TmdbVideo[] =
            videos.results?.filter(
                (v: TmdbVideo) => v.site === "YouTube" && v.type === "Trailer"
            ) ?? [];

        // --- Sélection typée des recommandations ---
        const mappedRecommendations: TmdbRecommendation[] =
            recommendations.results?.slice(0, 10).map(
                (r: TmdbRecommendation) => ({
                    id: r.id,
                    title: r.title || r.name, // TV fallback
                    poster_path: r.poster_path,
                    release_date: r.release_date || r.first_air_date,
                    overview: r.overview ?? "",
                    vote_average: r.vote_average ?? 0,
                })
            ) ?? [];

        // --- Réponse consolidée et typée ---
        const result: TmdbMovieFull = {
            details,
            credits,
            videos: { results: filteredVideos },
            recommendations: { results: mappedRecommendations },
            fetchedAt: new Date().toISOString(),
        };

        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "public, s-maxage=43200, stale-while-revalidate",
            },
        });
    } catch (error) {
        console.error("Erreur TMDB /[type]/[id]:", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
