import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

/**
 * Extension du module NextAuth pour personnaliser les types Session et User
 */
declare module "next-auth" {
    /**
     * Interface Session étendue avec des propriétés personnalisées
     * 
     * La session est l'objet accessible via useSession() ou getServerSession()
     * Elle contient les informations de l'utilisateur connecté
     */
    interface Session {
        user: {
            /** ID unique de l'utilisateur dans la base de données */
            id: string;
            /** Rôle de l'utilisateur (user, admin, etc.) pour les permissions */
            role: string;
            /** Date de création du compte utilisateur */
            createdAt: string;
        } & DefaultSession["user"]; // Conserve les propriétés par défaut (name, email, image)
    }

    /**
     * Interface User étendue avec des propriétés personnalisées
     * 
     * Représente l'utilisateur retourné par la méthode authorize() dans le CredentialsProvider
     */
    interface User extends DefaultUser {
        /** Rôle de l'utilisateur pour la gestion des accès */
        role: string;
        /** Date de création du compte utilisateur */
        createdAt: string;
    }
}

/**
 * Extension du module NextAuth JWT pour personnaliser le token JWT
 */
declare module "next-auth/jwt" {
    /**
     * Interface JWT étendue avec des propriétés personnalisées
     * 
     * Le JWT (JSON Web Token) est stocké dans un cookie sécurisé
     * et contient les informations de l'utilisateur chiffrées
     */
    interface JWT extends DefaultJWT {
        /** Rôle de l'utilisateur pour les autorisations */
        role: string;
        /** ID unique de l'utilisateur pour les requêtes base de données */
        id: string;
        /** Date de création du compte utilisateur */
        createdAt: string;
    }
}