import { z } from "zod";

/**
 * Validation des entrées utilisateur pour la gestion des listes (watchlist, watching, completed)
 */
export const UserMovieSchema = z.object({
    /**
     * ID du film ou de la série (TMDB)
     */
    itemId: z
        .number()
        .int()
        .positive()
        .describe("validation.itemIdInvalid"),

    /**
     * Type de contenu — movie ou tv
     */
    itemType: z.enum(["movie", "tv"], {
        message: "validation.itemTypeInvalid",
    }),

    /**
     * Statut de visionnage
     */
    status: z.enum(["watchlist", "watching", "completed"], {
        message: "validation.statusInvalid",
    }),
});

/**
 * Type TypeScript dérivé automatiquement du schéma
 */
export type UserMovieInput = z.infer<typeof UserMovieSchema>;
