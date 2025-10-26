import { z } from "zod";

/**
 * Schema de validation pour la connexion utilisateur.
 * Renvoie des clés i18n plutôt que des textes bruts.
 */
export const LoginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "auth.login.validation.emailRequired"),
    password: z
        .string()
        .trim()
        .min(1, "auth.login.validation.passwordRequired"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
