import { z } from "zod";

/**
 * Schéma de validation pour le renvoi de l’e-mail de vérification.
 *
 * Utilisé dans le composant ResendForm.
 * - L’e-mail est requis.
 * - Doit être un format d’adresse valide.
 * - Retourne des clés i18n "validation.*" cohérentes avec les autres schémas.
 */
export const ResendSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "validation.emailRequired")
        .email("validation.emailInvalid"),
});

export type ResendInput = z.infer<typeof ResendSchema>;
