import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FollowingUser {
    _id: string;
    pseudo: string;
    avatar: string;
}

interface FollowingState {
    users: FollowingUser[];
    loading: boolean;
    error: string | null;
}

const initialState: FollowingState = {
    users: [],
    loading: false,
    error: null,
};

export const followingSlice = createSlice({
    name: "following",
    initialState,
    reducers: {
        setFollowingUsers: (state, action: PayloadAction<FollowingUser[]>) => {
            state.users = action.payload;
            state.error = null;
        },
        addFollowingUser: (state, action: PayloadAction<FollowingUser>) => {
            if (!state.users.find((u) => u._id === action.payload._id)) {
                state.users.push(action.payload);
            }
        },
        removeFollowingUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter((u) => u._id !== action.payload);
        },
        setFollowingLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setFollowingError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setFollowingUsers,
    addFollowingUser,
    removeFollowingUser,
    setFollowingLoading,
    setFollowingError,
} = followingSlice.actions;

export default followingSlice.reducer;
