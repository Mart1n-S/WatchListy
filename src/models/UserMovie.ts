import { ObjectId, Db } from "mongodb";

/**
 * Type des statuts possibles pour un contenu utilisateur
 */
export type UserMovieStatus = "watchlist" | "watching" | "completed";

/**
 * Type du média (film ou série)
 */
export type ItemType = "movie" | "tv";

/**
 * Représente un film ou une série dans la liste personnelle d’un utilisateur.
 */
export interface UserMovie {
    _id?: ObjectId;
    userId: string;        // identifiant de l'utilisateur (NextAuth token.sub)
    itemId: number;        // ID TMDB (film ou série)
    itemType: ItemType;    // "movie" ou "tv"
    status: UserMovieStatus; // "watchlist", "watching" ou "completed"
    created_at: string | Date;
    updated_at: string | Date;
}

/**
 * Création d’un index pour garantir qu’un même utilisateur
 * ne puisse pas avoir deux fois le même item dans sa liste.
 */
export const createUserMovieIndexes = async (db: Db): Promise<void> => {
    await db.collection<UserMovie>("user_movies").createIndex(
        { userId: 1, itemId: 1, itemType: 1 },
        { unique: true }
    );
};
