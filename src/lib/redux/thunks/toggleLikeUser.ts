import { createAsyncThunk } from "@reduxjs/toolkit";
import { addLikedUser, removeLikedUser } from "../slices/userSlice";

/**
 * toggleLikeUser
 * ➜ Like ou Unlike la watchlist d’un utilisateur public
 */
export const toggleLikeUser = createAsyncThunk<
    { pseudo: string; liked: boolean; likesCount: number },
    string,
    { rejectValue: string }
>(
    "users/toggleLikeUser",
    async (pseudo, { rejectWithValue, dispatch }) => {
        try {
            const res = await fetch(`/api/users/${pseudo}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Erreur toggleLikeUser:", data);
                return rejectWithValue(data.error || "Erreur interne");
            }

            // Mise à jour du state utilisateur (Redux)
            if (data.liked) {
                dispatch(addLikedUser(pseudo));
            } else {
                dispatch(removeLikedUser(pseudo));
            }

            return {
                pseudo,
                liked: data.liked,
                likesCount: data.likesCount,
            };
        } catch (err) {
            console.error("Erreur réseau toggleLikeUser:", err);
            return rejectWithValue("Erreur réseau");
        }
    }
);
