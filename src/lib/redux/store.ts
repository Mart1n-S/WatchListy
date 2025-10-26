import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import genresReducer from './slices/genresSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            genres: genresReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
