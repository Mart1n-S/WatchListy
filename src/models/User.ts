import { ObjectId } from "mongodb";
// TODO: Voir pour update preferences avec un type plus précis peut-être un tableau des genres de films/séries favoris 
export interface User {
    _id?: ObjectId;
    pseudo: string;
    email: string;
    password: string; // Hashé
    avatar: string; // Référence à un avatar
    created_at: Date;
    verified_at: Date | null; // Null si non vérifié
    blocked_at: Date | null; // Null si actif
    role?: string; // "user", "admin"
    preferences?: Record<string, unknown>; // Ou un type plus précis si possible
}

// Type pour les documents de la collection
export type UserDocument = User & { _id: ObjectId };

// Type pour les données d'entrée (création/mise à jour)
export interface UserInput {
    pseudo: string;
    email: string;
    password: string;
    avatar: string;
    preferences?: Record<string, unknown>;
}
