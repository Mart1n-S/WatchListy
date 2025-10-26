import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string | null;
    createdAt: string | null;
    isAuthenticated: boolean;
    preferences?: {
        movies?: number[];
        tv?: number[];
    };
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    image: null,
    role: null,
    createdAt: null,
    isAuthenticated: false,
    preferences: {
        movies: [],
        tv: [],
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload, isAuthenticated: true };
        },
        clearUser: (state) => {
            state.id = null
            state.name = null
            state.email = null
            state.image = null
            state.role = null
            state.createdAt = null
            state.isAuthenticated = false
        },
    },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
