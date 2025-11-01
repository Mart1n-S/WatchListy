export const dynamic = "force-dynamic";
export const revalidate = 43200; // 12h

import { NextResponse } from "next/server";
import {
    TmdbVideo,
    TmdbRecommendation,
    TmdbMovieFull,
} from "@/types/tmdb";

const TMDB_BASE = process.env.TMDB_API_BASE!;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

/**
 * GET /api/tmdb/movies/[id]?lang=fr
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: movieId } = await context.params;
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get("lang") || "fr";
        const language = lang === "fr" ? "fr-FR" : "en-US";

        if (!movieId) {
            return NextResponse.json(
                { error: "Le paramètre 'id' est requis." },
                { status: 400 }
            );
        }

        // --- Appels parallèles à TMDB ---
        const [detailsRes, creditsRes, videosRes, recsRes] = await Promise.all([
            fetch(`${TMDB_BASE}/movie/${movieId}?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
            fetch(`${TMDB_BASE}/movie/${movieId}/credits?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
            fetch(`${TMDB_BASE}/movie/${movieId}/videos?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
            fetch(`${TMDB_BASE}/movie/${movieId}/recommendations?language=${language}`, {
                headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
                next: { revalidate: 43200 },
            }),
        ]);

        if (!detailsRes.ok) {
            return NextResponse.json(
                { error: "Film introuvable sur TMDB." },
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
                    title: r.title,
                    poster_path: r.poster_path,
                    release_date: r.release_date,
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
        console.error("Erreur TMDB /movies/[id]:", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
