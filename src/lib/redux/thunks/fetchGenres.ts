import { AppDispatch } from "../store";
import { setGenres } from "../slices/genresSlice";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const fetchGenres =
    (locale: string = "fr") =>
        async (dispatch: AppDispatch) => {
            const CACHE_KEY = `genres_cache_${locale}`;

            try {
                // Étape 1 — Vérifie le cache local
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const now = Date.now();

                    if (
                        parsed.fetchedAt &&
                        now - new Date(parsed.fetchedAt).getTime() < ONE_DAY_MS
                    ) {
                        dispatch(setGenres({ movies: parsed.movies, tv: parsed.tv }));
                        console.log(`Genres (${locale}) chargés depuis localStorage`);
                        return;
                    }
                }

                // Étape 2 — Fetch depuis API interne (serveur Next.js)
                const res = await fetch(`/api/tmdb/genres?lang=${locale}`, {
                    method: "GET",
                    cache: "force-cache",
                });

                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des genres depuis l’API interne");
                }

                const data = await res.json();

                // Stocke en Redux
                dispatch(setGenres({ movies: data.movies, tv: data.tv }));

                // Stocke en localStorage
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({
                        movies: data.movies,
                        tv: data.tv,
                        fetchedAt: data.fetchedAt,
                    })
                );

                console.log(`Genres (${locale}) chargés depuis /api/tmdb/genres`);
            } catch (error) {
                console.error("Erreur fetchGenres:", error);
            }
        };
