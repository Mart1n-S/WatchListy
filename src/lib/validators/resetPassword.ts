import { z } from "zod";

/**
 * Schéma de validation pour la réinitialisation du mot de passe
 *
 * Utilisé sur la page "reset-password"
 */
export const ResetPasswordSchema = z
    .object({
        /** Email — requis et valide */
        email: z.string().trim().email("validation.emailInvalid"),

        /** Nouveau mot de passe — règles identiques à RegisterSchema */
        password: z
            .string()
            .trim()
            .min(8, "validation.passwordMin")
            .max(30, "validation.passwordMax")
            .regex(/[A-Z]/, "validation.passwordUpper")
            .regex(/[a-z]/, "validation.passwordLower")
            .regex(/\d/, "validation.passwordNumber")
            .regex(/[^A-Za-z0-9]/, "validation.passwordSpecial"),

        /** Confirmation — doit correspondre au mot de passe */
        confirmPassword: z.string().trim().min(1, "validation.confirmPasswordRequired"),

        /** Token — obligatoire dans le flux */
        token: z.string().trim().min(1, "validation.tokenMissing"),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "validation.passwordsMismatch",
                path: ["confirmPassword"],
            });
        }
    });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
