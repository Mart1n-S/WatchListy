export const dynamic = "force-dynamic";
export const revalidate = 86400;

import { NextResponse } from "next/server";

const TMDB_BASE = process.env.TMDB_API_BASE!;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

export async function GET(request: Request) {
    try {
        // Récupère la langue depuis l'URL (par défaut fr)
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get("lang") || "fr";

        const [movieRes, tvRes] = await Promise.all([
            fetch(`${TMDB_BASE}/genre/movie/list?language=${lang}`, {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: 86400 },
            }),
            fetch(`${TMDB_BASE}/genre/tv/list?language=${lang}`, {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: 86400 },
            }),
        ]);

        if (!movieRes.ok || !tvRes.ok) {
            console.error(
                "TMDB Error details:",
                await movieRes.text(),
                await tvRes.text()
            );
            throw new Error("Erreur lors de la récupération des genres TMDB");
        }

        const [movies, tv] = await Promise.all([movieRes.json(), tvRes.json()]);

        // Réponse typée + cache HTTP public
        return NextResponse.json(
            {
                language: lang,
                movies: movies.genres,
                tv: tv.genres,
                fetchedAt: new Date().toISOString(),
                cached: true,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
                },
            }
        );
    } catch (error) {
        console.error("Erreur TMDB:", error);
        return NextResponse.json(
            { error: "Impossible de récupérer les genres." },
            { status: 500 }
        );
    }
}
