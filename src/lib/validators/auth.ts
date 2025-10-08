import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().trim().min(1, "L’email est requis"),
    password: z.string().trim().min(1, "Le mot de passe est requis"),
    remember: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;
