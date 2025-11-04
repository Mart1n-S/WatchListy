import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

/**
 * Extension du module NextAuth pour personnaliser les types Session, User et JWT
 */
declare module "next-auth" {
    interface Session {
        user: {
            /** ID unique de l'utilisateur dans la base de données */
            id: string;
            /** Rôle de l'utilisateur (user, admin, etc.) */
            role: string;
            /** Date de création du compte utilisateur */
            createdAt: string;
            /** IDs des utilisateurs suivis */
            followingIds?: string[];
            /** Pseudos ou IDs des utilisateurs likés */
            likedUsers?: string[];
            /** Préférences de genres (films et séries) */
            preferences?: {
                movies?: number[];
                tv?: number[];
            };
        } & DefaultSession["user"]; // garde name, email, image
    }

    interface User extends DefaultUser {
        /** Rôle de l'utilisateur */
        role: string;
        /** Date de création */
        createdAt: string;
        /** IDs des utilisateurs suivis */
        followingIds?: string[];
        /** Pseudos ou IDs des utilisateurs likés */
        likedUsers?: string[];
        /** Préférences de genres */
        preferences?: {
            movies?: number[];
            tv?: number[];
        };
    }
}

/**
 * Extension du module NextAuth JWT pour inclure les champs personnalisés
 */
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: string;
        createdAt: string;
        followingIds?: string[];
        likedUsers?: string[];
        preferences?: {
            movies?: number[];
            tv?: number[];
        };
    }
}
