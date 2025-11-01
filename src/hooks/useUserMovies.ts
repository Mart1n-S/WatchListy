"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { UserMovie } from "@/models/UserMovie";

/**
 * Hook pour gérer la liste personnelle de films/séries de l’utilisateur.
 */
export function useUserMovies() {
    const [movies, setMovies] = useState<UserMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Récupère toutes les entrées de la liste de l’utilisateur.
     */
    const fetchUserMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/user-movies", {
                cache: "no-store",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch user movies");

            const data = (await res.json()) as UserMovie[];
            setMovies(data);
        } catch (err) {
            console.error("Erreur lors du chargement des user movies :", err);
            setError("common.errors.internalServerError");
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Ajoute un contenu à la liste.
     */
    const addUserMovie = useCallback(
        async (
            itemId: number,
            itemType: "movie" | "tv",
            status: "watchlist" | "watching" | "completed"
        ) => {
            try {
                setError(null);

                const res = await fetch("/api/user-movies", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ itemId, itemType, status }),
                });

                if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error || "userMovies.validation.failed");
                }

                const newEntry = (await res.json()) as UserMovie;

                // MAJ locale sans refetch
                setMovies((prev) => [...prev, newEntry]);

                return true;
            } catch (err) {
                console.error("Erreur lors de l’ajout du film :", err);
                setError("userMovies.validation.failed");
                return false;
            }
        },
        []
    );


    /**
     * Met à jour le statut d’un contenu existant.
     */
    const updateUserMovie = useCallback(
        async (
            itemId: number,
            status: "watchlist" | "watching" | "completed"
        ) => {
            try {
                setError(null);

                const res = await fetch(`/api/user-movies/${itemId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ status }),
                });

                if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error || "userMovies.validation.failed");
                }

                await fetchUserMovies();
                return true;
            } catch (err) {
                console.error("Erreur lors de la mise à jour du statut :", err);
                setError("userMovies.validation.failed");
                return false;
            }
        },
        [fetchUserMovies]
    );

    /**
     * Supprime un contenu de la liste.
     */
    const deleteUserMovie = useCallback(async (itemId: number) => {
        try {
            setError(null);

            const res = await fetch(`/api/user-movies/${itemId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "userMovies.notFound");
            }

            setMovies((prev) => prev.filter((m) => m.itemId !== itemId));
            return true;
        } catch (err) {
            console.error("Erreur lors de la suppression du film :", err);
            setError("userMovies.notFound");
            return false;
        }
    }, []);

    /**
     * Permet de filtrer les films selon leur statut
     */
    const byStatus = useCallback(
        (status: "watchlist" | "watching" | "completed") =>
            movies.filter((m) => m.status === status),
        [movies]
    );

    // Mémorisation pour éviter des re-rendus inutiles
    const lists = useMemo(
        () => ({
            watchlist: byStatus("watchlist"),
            watching: byStatus("watching"),
            completed: byStatus("completed"),
        }),
        [byStatus]
    );

    useEffect(() => {
        fetchUserMovies();
    }, [fetchUserMovies]);

    return {
        movies,
        lists,
        loading,
        error,
        addUserMovie,
        updateUserMovie,
        deleteUserMovie,
        refetch: fetchUserMovies,
    };
}
