import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Only TMDB data (no user fields like status, userId, dates)
export type CachedTmdb = {
    title: string;
    poster_path: string | null;
    release_date?: string;
    vote_average?: number;
};

export interface TmdbState {
    // key: `${itemType}_${itemId}`
    cache: Record<string, CachedTmdb>;
}

const initialState: TmdbState = {
    cache: {},
};

export const tmdbSlice = createSlice({
    name: "tmdb",
    initialState,
    reducers: {
        setTmdbItem: (
            state,
            action: PayloadAction<{ key: string; data: CachedTmdb }>
        ) => {
            state.cache[action.payload.key] = action.payload.data;
        },
        clearTmdbCache: (state) => {
            state.cache = {};
        },
    },
});

export const { setTmdbItem, clearTmdbCache } = tmdbSlice.actions;
export default tmdbSlice.reducer;
