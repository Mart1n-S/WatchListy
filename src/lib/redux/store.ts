import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import genresReducer from './slices/genresSlice'
import userMoviesReducer from './slices/userMoviesSlice'
import tmdbReducer from './slices/tmdbSlice'

// Combine tous les reducers
const rootReducer = combineReducers({
    user: userReducer,
    genres: genresReducer,
    userMovies: userMoviesReducer,
    tmdb: tmdbReducer,
})

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        devTools: process.env.NODE_ENV !== 'production',
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
