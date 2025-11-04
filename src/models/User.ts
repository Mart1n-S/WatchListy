import { ObjectId, Db } from "mongodb";

export interface User {
    _id?: ObjectId;
    pseudo: string; // pseudo unique (sert pour le suivi)
    email: string;
    password: string;
    avatar: string;
    created_at: Date;
    verified_at: Date | null;
    blocked_at: Date | null;
    role?: string;

    preferences?: {
        movies: number[]; // IDs de genres de films
        tv: number[]; // IDs de genres de séries
    };

    following: ObjectId[]; // Liste des userId suivis
    likesReceived: ObjectId[]; // Liste des userId qui ont liké la watchlist de cet utilisateur
}

/** Type pour les documents stockés dans MongoDB */
export type UserDocument = User & { _id: ObjectId };

/** Type pour les données d'entrée (création / mise à jour) */
export interface UserInput {
    pseudo: string;
    email: string;
    password: string;
    avatar: string;
    preferences?: {
        movies: number[];
        tv: number[];
    };
}

/**
 * Crée les index nécessaires pour la collection "users"
 */
export const createUserIndexes = async (db: Db): Promise<void> => {
    await db.collection<User>("users").createIndex({ pseudo: 1 }, { unique: true });
    await db.collection<User>("users").createIndex({ email: 1 }, { unique: true });
    await db.collection<User>("users").createIndex({ likesReceived: 1 }); // pour trier par popularité
};
