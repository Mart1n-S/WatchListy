import { z } from "zod";

/**
 * Validation du suivi utilisateur (follow/unfollow)
 * Retourne des clés i18n pour les messages d’erreur.
 */
export const followSchema = z.object({
    pseudo: z
        .string()
        .trim()
        .min(3, "Follow.validation.pseudoMin")
        .max(30, "Follow.validation.pseudoMax")
        .regex(/^[a-zA-Z0-9_]+$/, "Follow.validation.pseudoInvalid"),
});

export type FollowInput = z.infer<typeof followSchema>;
