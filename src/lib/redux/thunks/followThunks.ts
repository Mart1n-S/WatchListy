import { AppDispatch } from "../store";
import {
    setFollowingUsers,
    removeFollowingUser,
    setFollowingLoading,
    setFollowingError,
} from "../slices/followingSlice";
import { setFollowingIds } from "../slices/userSlice";

/**
 * Récupère la liste complète des utilisateurs suivis
 */
export const fetchFollowingUsers = () => async (dispatch: AppDispatch) => {
    dispatch(setFollowingLoading(true));
    try {
        const res = await fetch("/api/users/following");
        if (!res.ok) throw new Error("fetch_failed");
        const data = await res.json();
        dispatch(setFollowingUsers(data));
    } catch (err) {
        console.error("Erreur récupération following :", err);
        dispatch(setFollowingError("Follow.errors.fetchFailed"));
    } finally {
        dispatch(setFollowingLoading(false));
    }
};

/**
 * Suivre un utilisateur par pseudo
 */
export const followUser =
    (pseudo: string) => async (dispatch: AppDispatch): Promise<boolean> => {
        try {
            const res = await fetch("/api/users/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pseudo }),
            });

            if (!res.ok) throw new Error("follow_failed");

            const data = await res.json();

            // Met à jour les IDs suivis + recharge la liste
            dispatch(setFollowingIds(data.following));
            dispatch(fetchFollowingUsers());
            return true;
        } catch (err) {
            console.error("Erreur follow :", err);
            dispatch(setFollowingError("Follow.errors.followFailed"));
            return false;
        }
    };

/**
 * Se désabonner d’un utilisateur
 */
export const unfollowUser =
    (userId: string) => async (dispatch: AppDispatch): Promise<boolean> => {
        try {
            const res = await fetch(`/api/users/follow?userId=${userId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("unfollow_failed");

            const data = await res.json();

            // Met à jour les IDs suivis + supprime localement l’utilisateur
            dispatch(setFollowingIds(data.following));
            dispatch(removeFollowingUser(userId));
            return true;
        } catch (err) {
            console.error("Erreur unfollow :", err);
            dispatch(setFollowingError("Follow.errors.unfollowFailed"));
            return false;
        }
    };
