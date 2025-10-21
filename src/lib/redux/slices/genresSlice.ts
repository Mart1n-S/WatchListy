import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Genre {
    id: number;
    name: string;
}

export interface GenresState {
    movies: Genre[];
    tv: Genre[];
}

const initialState: GenresState = {
    movies: [],
    tv: [],
};

const genresSlice = createSlice({
    name: 'genres',
    initialState,
    reducers: {
        setGenres: (state, action: PayloadAction<GenresState>) => {
            state.movies = action.payload.movies;
            state.tv = action.payload.tv;
        },
    },
});

export const { setGenres } = genresSlice.actions;
export default genresSlice.reducer;
