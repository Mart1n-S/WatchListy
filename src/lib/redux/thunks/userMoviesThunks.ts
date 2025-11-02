import type { AppDispatch, RootState } from "../store";
import {
    setLoading,
    setUserMovies,
    addUserMovie,
    removeUserMovie,
    updateUserMovieStatus,
} from "../slices/userMoviesSlice";
import type { UserMovie } from "@/models/UserMovie";

/* ---------- FETCH ---------- */
export const fetchUserMovies = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch("/api/user-movies");
        if (!res.ok) throw new Error("fetch_failed");
        const data: UserMovie[] = await res.json();
        dispatch(setUserMovies(data));
    } catch (err) {
        console.error("Erreur de récupération des listes :", err);
    } finally {
        dispatch(setLoading(false));
    }
};

/* ---------- UPDATE ---------- */
export const updateUserMovieStatusThunk =
    (itemId: number, newStatus: "watchlist" | "watching" | "completed") =>
        async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
            const { userMovies } = getState();
            const findIn = (arr: UserMovie[]) => arr.find((m) => m.itemId === itemId);
            const oldMovie =
                findIn(userMovies.watchlist) ??
                findIn(userMovies.watching) ??
                findIn(userMovies.completed);

            if (!oldMovie) return false;

            // Optimistic
            dispatch(updateUserMovieStatus({ itemId, newStatus }));

            try {
                const res = await fetch(`/api/user-movies/${itemId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });

                if (!res.ok) throw new Error("update_failed");
                return true;
            } catch (err) {
                console.error("Erreur lors de la mise à jour :", err);
                // rollback
                dispatch(updateUserMovieStatus({ itemId, newStatus: oldMovie.status }));
                return false;
            }
        };

/* ---------- DELETE ---------- */
export const deleteUserMovieThunk =
    (itemId: number) =>
        async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
            const { userMovies } = getState();

            const backup = {
                watchlist: [...userMovies.watchlist],
                watching: [...userMovies.watching],
                completed: [...userMovies.completed],
            };

            // Optimistic delete
            dispatch(removeUserMovie(itemId));

            try {
                const res = await fetch(`/api/user-movies/${itemId}`, { method: "DELETE" });
                if (!res.ok) throw new Error("delete_failed");
                return true;
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                // rollback complet
                dispatch(
                    setUserMovies([
                        ...backup.watchlist,
                        ...backup.watching,
                        ...backup.completed,
                    ])
                );
                return false;
            }
        };

/* ---------- ADD ---------- */
export const addUserMovieThunk =
    (newMovie: UserMovie) =>
        async (dispatch: AppDispatch): Promise<boolean> => {
            // Optimistic add
            dispatch(addUserMovie(newMovie));

            try {
                const res = await fetch("/api/user-movies", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newMovie),
                });

                if (!res.ok) throw new Error("add_failed");

                const created: UserMovie = await res.json();

                // Remplace le placeholder
                dispatch(removeUserMovie(newMovie.itemId));
                dispatch(addUserMovie(created));

                return true;
            } catch (err) {
                console.error("Erreur lors de l’ajout :", err);
                // rollback
                dispatch(removeUserMovie(newMovie.itemId));
                return false;
            }
        };
