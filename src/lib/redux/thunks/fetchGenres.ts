import { AppDispatch } from "../store";
import { setGenres } from "../slices/genresSlice";

const CACHE_KEY = "genres_cache";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const fetchGenres = () => async (dispatch: AppDispatch) => {
    try {
        // Étape 1 — Vérifie le cache local
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            const now = Date.now();

            // Si moins de 24h, on réutilise le cache
            if (parsed.fetchedAt && now - new Date(parsed.fetchedAt).getTime() < ONE_DAY_MS) {
                dispatch(setGenres({ movies: parsed.movies, tv: parsed.tv }));
                console.log("Genres chargés depuis localStorage");
                return;
            }
        }

        // Étape 2 — Fetch depuis API interne (serveur Next.js)
        const res = await fetch("/api/tmdb/genres", {
            method: "GET",
            cache: "force-cache", // Utilise le cache de Next.js si dispo
        });

        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des genres depuis l’API interne");
        }

        const data = await res.json();

        // Stocke en Redux
        dispatch(setGenres({ movies: data.movies, tv: data.tv }));

        // Et dans localStorage avec la date
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                movies: data.movies,
                tv: data.tv,
                fetchedAt: data.fetchedAt,
            })
        );

        console.log("Genres chargés depuis /api/tmdb/genres");
    } catch (error) {
        console.error("Erreur fetchGenres:", error);
    }
};
