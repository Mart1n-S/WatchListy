import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from "./mongodb";
import { compare } from "bcryptjs";
import { LoginSchema } from "./validators/auth";

/**
 * Configuration principale de NextAuth.js
 * 
 * Ce fichier définit les options d'authentification pour l'application,
 * incluant les providers, la stratégie de session, les callbacks et les pages personnalisées.
 * 
 */
export const authOptions: NextAuthOptions = {
    /**
     * Adaptateur MongoDB pour stocker les sessions, comptes et tokens de vérification
     * Utilise la connexion MongoDB existante de l'application
     */
    adapter: MongoDBAdapter(
        Promise.resolve(connectToDatabase().then(({ client }) => client))
    ),

    /**
     * Fournisseurs d'authentification supportés
     * Ici uniquement l'authentification par credentials (email/mot de passe)
     */
    providers: [
        CredentialsProvider({
            /**
             * Nom identifiant ce provider
             */
            name: "credentials",

            /**
             * Définition des champs d'identification
             * Ces champs correspondent aux inputs du formulaire de connexion
             */
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            /**
             * Fonction d'autorisation - Coeur de l'authentification
             * Valide les credentials et retourne l'utilisateur si valide
             * 
             * @param credentials - Les identifiants soumis par l'utilisateur
             * @returns User object si authentification réussie, null sinon
             * @throws Error avec message descriptif en cas d'échec
             */
            async authorize(credentials) {
                try {
                    // Validation des champs avec Zod
                    const validatedFields = LoginSchema.safeParse(credentials);
                    if (!validatedFields.success) {
                        throw new Error("Champs invalides");
                    }

                    const { email, password } = validatedFields.data;

                    // Connexion à MongoDB
                    const { db } = await connectToDatabase();

                    // Recherche de l’utilisateur (insensible à la casse)
                    const user = await db.collection("users").findOne({
                        email: email.toLowerCase(),
                    });

                    if (!user) {
                        throw new Error("Aucun utilisateur trouvé avec cet email");
                    }

                    // Vérification que le compte est vérifié
                    if (!user.verified_at) {
                        throw new Error("Votre adresse e-mail n’a pas encore été vérifiée");
                    }

                    // Vérification que le compte n’est pas bloqué
                    if (user.blocked_at) {
                        throw new Error("Ce compte a été bloqué");
                    }

                    // Vérification du mot de passe
                    const isPasswordValid = await compare(password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Mot de passe incorrect");
                    }

                    // Retourne l’objet utilisateur pour NextAuth
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.pseudo,
                        image: user.avatar,
                        role: user.role || "user",
                        createdAt: user.created_at?.toISOString(),
                    };
                } catch (error) {
                    console.error("Erreur d’authentification :", error);
                    throw error;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2 heures
    },

    /**
     * Callbacks pour personnaliser le comportement de NextAuth
     * Permettent d'ajouter des données personnalisées aux tokens et sessions
     */
    callbacks: {
        /**
         * Callback JWT - Exécuté quand un JWT est créé ou mis à jour
         * Permet d'ajouter des claims personnalisés au token
         * 
         * @param token - Le token JWT actuel
         * @param user - L'utilisateur (seulement lors de la connexion initiale)
         * @returns Token JWT mis à jour
         */
        async jwt({ token, user }) {
            // Lors de la première connexion, ajoute les propriétés personnalisées
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.createdAt = user.createdAt;
            }
            return token;
        },

        /**
         * Callback Session - Exécuté quand une session est vérifiée
         * Permet d'ajouter des données personnalisées à l'objet session
         * 
         * @param session - La session actuelle
         * @param token - Le token JWT contenant les données
         * @returns Session mise à jour avec les données personnalisées
         */
        async session({ session, token }) {
            // Transfère les données du token vers la session
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.createdAt = token.createdAt as string;
            }
            return session;
        },
    },

    /**
     * Pages personnalisées pour remplacer les pages par défaut de NextAuth
     */
    pages: {
        signIn: "/login",
        error: "/login",
    },

    /**
     * Secret utilisé pour signer les tokens JWT
     */
    secret: process.env.NEXTAUTH_SECRET,
};
