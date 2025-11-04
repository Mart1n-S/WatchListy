import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Structure du state utilisateur */
interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string | null;
    createdAt: string | null;
    isAuthenticated: boolean;
    followingIds: string[];
    likedUsers: string[];
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
    followingIds: [],
    likedUsers: [],
    preferences: {
        movies: [],
        tv: [],
    },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        /** Hydrate le store avec les infos NextAuth */
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload, isAuthenticated: true };
        },

        /** Déconnexion ou suppression des données utilisateur */
        clearUser: (state) => {
            state.id = null;
            state.name = null;
            state.email = null;
            state.image = null;
            state.role = null;
            state.createdAt = null;
            state.isAuthenticated = false;
            state.followingIds = [];
            state.likedUsers = [];
            state.preferences = { movies: [], tv: [] };
        },

        /** Met à jour les IDs suivis */
        setFollowingIds: (state, action: PayloadAction<string[]>) => {
            state.followingIds = action.payload;
        },

        /** Met à jour les likes */
        setLikedUsers: (state, action: PayloadAction<string[]>) => {
            state.likedUsers = action.payload;
        },

        /** Ajoute un utilisateur liké */
        addLikedUser: (state, action: PayloadAction<string>) => {
            if (!state.likedUsers.includes(action.payload)) {
                state.likedUsers.push(action.payload);
            }
        },

        /** Retire un utilisateur des likes */
        removeLikedUser: (state, action: PayloadAction<string>) => {
            state.likedUsers = state.likedUsers.filter(
                (id) => id !== action.payload
            );
        },
    },
});

export const {
    setUser,
    clearUser,
    setFollowingIds,
    setLikedUsers,
    addLikedUser,
    removeLikedUser,
} = userSlice.actions;

export default userSlice.reducer;
