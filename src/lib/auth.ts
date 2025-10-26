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
                const validatedFields = LoginSchema.safeParse(credentials);
                if (!validatedFields.success) throw new Error("auth.login.errors.invalidFields");

                const { email, password } = validatedFields.data;
                const { db } = await connectToDatabase();

                const user = await db.collection("users").findOne({
                    email: email.toLowerCase(),
                });

                if (!user) throw new Error("auth.login.errors.userNotFound");
                if (!user.verified_at) throw new Error("auth.login.errors.emailNotVerified");
                if (user.blocked_at) throw new Error("auth.login.errors.accountBlocked");

                const isPasswordValid = await compare(password, user.password);
                if (!isPasswordValid) throw new Error("auth.login.errors.invalidCredentials");

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.pseudo,
                    image: user.avatar,
                    role: user.role || "user",
                    createdAt: user.created_at?.toISOString(),
                    preferences: user.preferences || { movies: [], tv: [] },
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2h
    },

    /**
     * Callbacks pour personnaliser le comportement de NextAuth
     * Permettent d'ajouter des données personnalisées aux tokens et sessions
     */
    callbacks: {
        /**
         * JWT callback — met à jour le token
         * gère les connexions ET les updates manuels depuis `update()`
         */
        async jwt({ token, user, trigger, session }) {
            // Première connexion
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.createdAt = user.createdAt;
                token.preferences = user.preferences;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
            }

            // Lorsqu'on appelle update() côté client
            if (trigger === "update" && session?.user) {
                token.name = session.user.name;
                token.image = session.user.image;
                token.preferences = session.user.preferences;
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
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.createdAt = token.createdAt as string;
                session.user.preferences = token.preferences;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
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
