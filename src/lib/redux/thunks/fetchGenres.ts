import { createCachedThunk } from "../utils/createCachedThunk";
import { setGenres } from "../slices/genresSlice";
import type { GenresState } from "../slices/genresSlice";

export const fetchGenres = (locale: string = "fr") =>
    createCachedThunk<GenresState, ReturnType<typeof setGenres>>({
        cacheKey: `genres_cache_${locale}`,
        fetcher: async () => {
            const res = await fetch(`/api/tmdb/genres?lang=${locale}`);
            if (!res.ok) throw new Error("Erreur API genres");
            const data = await res.json();
            return { movies: data.movies, tv: data.tv };
        },
        onData: (data) => setGenres(data),
    });
