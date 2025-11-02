import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserMovie } from "@/models/UserMovie";

export interface UserMoviesState {
    watchlist: UserMovie[];
    watching: UserMovie[];
    completed: UserMovie[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: UserMoviesState = {
    watchlist: [],
    watching: [],
    completed: [],
    loading: false,
    error: null,
    lastFetched: null,
};

export const userMoviesSlice = createSlice({
    name: "userMovies",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setUserMovies: (state, action: PayloadAction<UserMovie[]>) => {
            // Tri automatique dans les 3 listes
            const watchlist: UserMovie[] = [];
            const watching: UserMovie[] = [];
            const completed: UserMovie[] = [];

            action.payload.forEach((movie) => {
                if (movie.status === "watchlist") watchlist.push(movie);
                else if (movie.status === "watching") watching.push(movie);
                else if (movie.status === "completed") completed.push(movie);
            });

            state.watchlist = watchlist;
            state.watching = watching;
            state.completed = completed;
            state.lastFetched = Date.now();
        },

        addUserMovie: (state, action: PayloadAction<UserMovie>) => {
            state[action.payload.status].push(action.payload);
        },

        removeUserMovie: (state, action: PayloadAction<number>) => {
            // Supprime dans toutes les listes (au cas où)
            (["watchlist", "watching", "completed"] as const).forEach((list) => {
                state[list] = state[list].filter(
                    (m) => m.itemId !== action.payload
                );
            });
        },

        updateUserMovieStatus: (
            state,
            action: PayloadAction<{
                itemId: number;
                newStatus: "watchlist" | "watching" | "completed";
            }>
        ) => {
            const listKeys: Array<"watchlist" | "watching" | "completed"> = [
                "watchlist",
                "watching",
                "completed",
            ];

            // Trouver le film dans les trois listes
            const movie =
                listKeys
                    .map((key) => state[key].find((m) => m.itemId === action.payload.itemId))
                    .find((m): m is UserMovie => !!m) ?? null;

            if (!movie) return;

            // Retirer l’élément de toutes les listes
            listKeys.forEach((key) => {
                state[key] = state[key].filter(
                    (m) => m.itemId !== action.payload.itemId
                );
            });

            // Ajouter dans la nouvelle liste
            state[action.payload.newStatus].push({
                ...movie,
                status: action.payload.newStatus,
            });
        },

        clearUserMovies: (state) => {
            state.watchlist = [];
            state.watching = [];
            state.completed = [];
            state.loading = false;
            state.error = null;
            state.lastFetched = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setUserMovies,
    addUserMovie,
    removeUserMovie,
    updateUserMovieStatus,
    clearUserMovies,
} = userMoviesSlice.actions;

export default userMoviesSlice.reducer;
