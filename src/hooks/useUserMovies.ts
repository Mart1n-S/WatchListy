"use client";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
    fetchUserMovies,
    addUserMovieThunk,
    deleteUserMovieThunk,
    updateUserMovieStatusThunk,
} from "@/lib/redux/thunks/userMoviesThunks";
import { useCallback, useEffect, useMemo } from "react";
import type { UserMovie } from "@/models/UserMovie";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function useUserMovies() {
    const dispatch = useAppDispatch();
    const { watchlist, watching, completed, loading, error, lastFetched } =
        useAppSelector((state) => state.userMovies);

    // --- Chargement initial avec cache ---
    useEffect(() => {
        const isStale = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;

        if (isStale) {
            dispatch(fetchUserMovies());
        }
    }, [dispatch, lastFetched]);

    // --- Ajouter un film/série ---
    const addUserMovie = useCallback(
        async (
            itemId: number,
            itemType: "movie" | "tv",
            status: "watchlist" | "watching" | "completed"
        ): Promise<boolean> => {
            const newMovie: Omit<UserMovie, 'created_at' | 'updated_at'> & {
                created_at: string;
                updated_at: string;
            } = {
                itemId,
                itemType,
                status,
                userId: "", // géré côté serveur
                created_at: new Date().toISOString(), // Convertir en string
                updated_at: new Date().toISOString(), // Convertir en string
            };

            return await dispatch(addUserMovieThunk(newMovie));
        },
        [dispatch]
    );

    // --- Mettre à jour le statut ---
    const updateUserMovie = useCallback(
        async (
            itemId: number,
            status: "watchlist" | "watching" | "completed"
        ): Promise<boolean> => {
            return await dispatch(updateUserMovieStatusThunk(itemId, status));
        },
        [dispatch]
    );

    // --- Supprimer un film/série ---
    const deleteUserMovie = useCallback(
        async (itemId: number): Promise<boolean> => {
            return await dispatch(deleteUserMovieThunk(itemId));
        },
        [dispatch]
    );

    // --- Regrouper les listes ---
    const lists = useMemo(
        () => ({
            watchlist,
            watching,
            completed,
        }),
        [watchlist, watching, completed]
    );

    return {
        movies: [...watchlist, ...watching, ...completed],
        lists,
        loading,
        error,
        addUserMovie,
        updateUserMovie,
        deleteUserMovie,
        refetch: () => dispatch(fetchUserMovies()),
    };
}