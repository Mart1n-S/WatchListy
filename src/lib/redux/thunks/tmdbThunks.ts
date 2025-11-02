import { setTmdbItem, type CachedTmdb } from "../slices/tmdbSlice";
import type { AppDispatch, RootState } from "../store";

export const fetchTmdbDetails =
    (itemId: number, itemType: "movie" | "tv", locale: string) =>
        async (dispatch: AppDispatch, getState: () => RootState): Promise<CachedTmdb | null> => {
            const { tmdb } = getState();
            const key = `${itemType}_${itemId}`;

            if (tmdb.cache[key]) {
                return tmdb.cache[key];
            }

            try {
                const res = await fetch(`/api/tmdb/${itemType}/${itemId}?lang=${locale}`);
                if (!res.ok) throw new Error("TMDB fetch failed");
                const data = await res.json();

                const cached: CachedTmdb = {
                    title: data.details.title || data.details.name,
                    poster_path: data.details.poster_path ?? null,
                    release_date: data.details.release_date || data.details.first_air_date,
                    vote_average: data.details.vote_average,
                };

                dispatch(setTmdbItem({ key, data: cached }));
                return cached;
            } catch (err) {
                console.error("Erreur TMDB thunk :", err);
                return null;
            }
        };
