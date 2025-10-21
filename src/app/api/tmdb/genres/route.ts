import { NextResponse } from "next/server";

const TMDB_BASE = process.env.TMDB_API_BASE!;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const ONE_DAY = 60 * 60 * 24;

// Active le cache ISR côté serveur / CDN (Vercel)
export const revalidate = ONE_DAY;

export async function GET() {
    try {
        // Les 2 requêtes TMDB parallèles avec cache serveur
        const [movieRes, tvRes] = await Promise.all([
            fetch(`${TMDB_BASE}/genre/movie/list?language=fr`, {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: ONE_DAY }, // cache 24h
            }),
            fetch(`${TMDB_BASE}/genre/tv/list?language=fr`, {
                headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    Accept: "application/json",
                },
                next: { revalidate: ONE_DAY },
            }),
        ]);

        if (!movieRes.ok || !tvRes.ok) {
            throw new Error("Erreur lors de la récupération des genres TMDB");
        }

        const [movies, tv] = await Promise.all([movieRes.json(), tvRes.json()]);

        // Réponse typée + cache HTTP public
        return NextResponse.json(
            {
                movies: movies.genres,
                tv: tv.genres,
                fetchedAt: new Date().toISOString(),
                cached: true,
            },
            {
                headers: {
                    "Cache-Control": `public, s-maxage=${ONE_DAY}, stale-while-revalidate`,
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
