import { z } from "zod";
/**
 * Schéma de validation pour une critique de film
 * utilisé pour la création et la mise à jour des reviews
 * 
 */
export const ReviewSchema = z.object({
    /**
     * ID du film TMDB
     */
    movieId: z
        .number()
        .int()
        .positive({ message: "review.validation.movieIdInvalid" }),

    /**
     * Note de la critique
     */
    rating: z
        .number()
        .min(1, { message: "review.invalidRating" })
        .max(10, { message: "review.invalidRating" }),

    /**
     * Commentaire de la critique
     */
    comment: z
        .string()
        .trim()
        .min(1, { message: "review.commentRequired" })
        .max(1000, { message: "review.commentTooLong" })
        .transform((val) =>
            val
                .replace(/<[^>]*>?/gm, "")
                .replace(/[<>]/g, "")
                .replace(/\s+/g, " ")
                .trim()
        ),

    /** Utilisateur associé à la critique (optionnel, géré côté serveur)
     * - userId : ID unique de l’utilisateur
     * - userName : pseudo de l’utilisateur
     * - userImage : URL de l’avatar de l’utilisateur (nullable)
     */
    userId: z.string().optional(),
    userName: z.string().optional(),
    userImage: z.string().nullable().optional(),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;
