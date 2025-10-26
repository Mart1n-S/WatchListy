import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du profil utilisateur
 *
 * - Tous les champs sont optionnels, car l’utilisateur peut ne modifier qu’une partie de son profil
 * - Les champs de mot de passe acceptent la chaîne vide ("") pour permettre la saisie puis l’effacement
 * - Les règles croisées (superRefine) ne s’appliquent que si l’utilisateur essaie de changer le mot de passe
 */
export const updateUserSchema = z
    .object({
        /**
         * Pseudo : 2 à 30 caractères, lettres / chiffres / underscore uniquement
         */
        pseudo: z
            .string()
            .trim()
            .min(2, "validation.pseudoMin")
            .max(30, "validation.pseudoMax")
            .regex(/^[a-zA-Z0-9_]+$/, "validation.pseudoRegex")
            .optional()
            .transform((val) => (val === "" ? undefined : val)),

        /**
         * Avatar : nom de fichier (ex: "avatar3.svg")
         */
        avatar: z
            .string()
            .regex(/^avatar\d+\.svg$/, "validation.avatarInvalid")
            .optional()
            .transform((val) => (val === "" ? undefined : val)),

        /**
         * Préférences : listes d'identifiants TMDB
         */
        preferences: z
            .object({
                movies: z.array(z.number()).optional(),
                tv: z.array(z.number()).optional(),
            })
            .optional(),

        /**
         * Ancien mot de passe — requis uniquement si un changement est initié
         *  → accepte la chaîne vide pour éviter une erreur si l’utilisateur tape puis efface
         */
        oldPassword: z
            .union([z.literal(""), z.string()])
            .optional()
            .transform((val) => (val === "" ? undefined : val)),

        /**
         * Nouveau mot de passe — doit respecter des critères de sécurité
         *  → accepte aussi "" pour éviter de bloquer après effacement
         */
        newPassword: z
            .union([
                z.literal(""),
                z
                    .string()
                    .min(8, "validation.passwordMin")
                    .max(30, "validation.passwordMax")
                    .regex(/[A-Z]/, "validation.passwordUpper")
                    .regex(/[a-z]/, "validation.passwordLower")
                    .regex(/\d/, "validation.passwordNumber")
                    .regex(/[^A-Za-z0-9]/, "validation.passwordSpecial"),
            ])
            .optional()
            .transform((val) => (val === "" ? undefined : val)),

        /**
         * Confirmation du nouveau mot de passe
         *  → accepte "" pour permettre la suppression sans erreur
         */
        confirmPassword: z
            .union([z.literal(""), z.string()])
            .optional()
            .transform((val) => (val === "" ? undefined : val)),
    })
    .superRefine((data, ctx) => {
        const hasOld = !!data.oldPassword;
        const hasNew = !!data.newPassword;
        const hasConfirm = !!data.confirmPassword;

        // Si l’utilisateur tente un changement de mot de passe :
        if (hasNew || hasConfirm) {
            // Ancien mot de passe requis
            if (!hasOld) {
                ctx.addIssue({
                    code: "custom",
                    message: "validation.oldPasswordRequired",
                    path: ["oldPassword"],
                });
            }

            // Nouveau mot de passe requis
            if (!hasNew) {
                ctx.addIssue({
                    code: "custom",
                    message: "validation.newPasswordRequired",
                    path: ["newPassword"],
                });
            }

            // Confirmation requise
            if (!hasConfirm) {
                ctx.addIssue({
                    code: "custom",
                    message: "validation.confirmPasswordRequired",
                    path: ["confirmPassword"],
                });
            }

            // Vérification de correspondance
            if (
                data.newPassword &&
                data.confirmPassword &&
                data.newPassword !== data.confirmPassword
            ) {
                ctx.addIssue({
                    code: "custom",
                    message: "validation.passwordsMismatch",
                    path: ["confirmPassword"],
                });
            }
        }
    });

/**
 * Type TypeScript dérivé automatiquement du schéma
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
