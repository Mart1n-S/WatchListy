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
            .min(2, "Le pseudo doit contenir au moins 2 caractères")
            .max(30, "Le pseudo ne peut pas dépasser 30 caractères")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Le pseudo ne peut contenir que des lettres, chiffres et underscores"
            )
            .optional()
            .transform((val) => (val === "" ? undefined : val)),

        /**
         * Avatar : nom de fichier (ex: "avatar3.svg")
         */
        avatar: z
            .string()
            .regex(/^avatar\d+\.svg$/, "Avatar invalide")
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
                    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
                    .max(30, "Le mot de passe ne peut pas dépasser 30 caractères")
                    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
                    .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
                    .regex(/\d/, "Le mot de passe doit contenir un chiffre")
                    .regex(
                        /[^A-Za-z0-9]/,
                        "Le mot de passe doit contenir un caractère spécial"
                    ),
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
                    message: "L'ancien mot de passe est requis",
                    path: ["oldPassword"],
                });
            }

            // Nouveau mot de passe requis
            if (!hasNew) {
                ctx.addIssue({
                    code: "custom",
                    message: "Le nouveau mot de passe est requis",
                    path: ["newPassword"],
                });
            }

            // Confirmation requise
            if (!hasConfirm) {
                ctx.addIssue({
                    code: "custom",
                    message: "Veuillez confirmer le mot de passe",
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
                    message: "Les mots de passe ne correspondent pas",
                    path: ["confirmPassword"],
                });
            }
        }
    });

/**
 * Type TypeScript dérivé automatiquement du schéma
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
