import { z } from "zod";

/**
 * Schéma de validation pour la création de compte (inscription)
 *
 * Tous les messages d'erreurs sont des clés i18n (ex: "validation.emailRequired")
 *
 * Note :
 * - Tous les champs sont requis à l’inscription
 * - Les règles de sécurité du mot de passe sont identiques à celles du profil
 */

export const RegisterSchema = z
    .object({
        /**
         * Email
         * - requis
         * - doit ressembler à un email valide
         */
        email: z
            .string()
            .trim()
            .pipe(z.email("validation.emailInvalid")),

        /**
         * Pseudo (nom d'utilisateur public)
         * - requis
         * - 2 à 30 caractères
         * - lettres / chiffres / underscore uniquement
         */
        pseudo: z
            .string()
            .trim()
            .min(2, "validation.pseudoMin")
            .max(30, "validation.pseudoMax")
            .regex(/^[a-zA-Z0-9_]+$/, "validation.pseudoRegex"),

        /**
         * Mot de passe
         * - requis
         * - 8 à 30 caractères
         * - doit contenir majuscule, minuscule, chiffre, spécial
         */
        password: z
            .string()
            .trim()
            .min(8, "validation.passwordMin")
            .max(30, "validation.passwordMax")
            .regex(/[A-Z]/, "validation.passwordUpper")
            .regex(/[a-z]/, "validation.passwordLower")
            .regex(/\d/, "validation.passwordNumber")
            .regex(/[^A-Za-z0-9]/, "validation.passwordSpecial"),

        /**
         * Confirmation du mot de passe
         * - requis
         * - doit matcher `password`
         */
        confirmPassword: z
            .string()
            .trim()
            .min(1, "validation.confirmPasswordRequired"),

        /**
         * Avatar
         * - requis
         * - doit être un fichier au format "avatarX.svg"
         */
        avatar: z
            .string()
            .regex(/^avatar\d+\.svg$/, "validation.avatarInvalid"),

        /**
         * Préférences : genres favoris (IDs TMDB)
         * - chaque champ est optionnel mais au moins un peut être sélectionné
         */
        preferences: z.object({
            movies: z.array(z.number()).default([]),
            tv: z.array(z.number()).default([]),
        }),
    })
    .superRefine((data, ctx) => {
        // Vérification correspondance des mots de passe
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "validation.passwordsMismatch",
                path: ["confirmPassword"],
            });
        }

    });

/**
 * Type TypeScript dérivé automatiquement du schéma
 */
export type RegisterInput = z.infer<typeof RegisterSchema>;
