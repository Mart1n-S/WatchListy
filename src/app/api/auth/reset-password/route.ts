import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ResetPasswordSchema } from "@/lib/validators/resetPassword";
import { z } from "zod";

/**
 * POST /api/auth/reset-password
 * Réinitialise le mot de passe si le token est valide et non expiré.
 */
export async function POST(req: Request) {
    try {
        const json = await req.json();

        // --- Validation du corps de la requête via Zod ---
        const parsed = ResetPasswordSchema.safeParse(json);
        if (!parsed.success) {
            const issue = parsed.error.issues[0];
            return NextResponse.json({ error: issue.message }, { status: 400 });
        }

        const { email, password, token } = parsed.data;
        const { db } = await connectToDatabase();

        // --- On hash le token reçu avant de le comparer ---
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // --- Recherche de l’utilisateur avec le token hashé ---
        const user = await db.collection("users").findOne({
            email: email.toLowerCase(),
            reset_token: hashedToken,
        });

        if (!user) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.emailInvalid" },
                { status: 400 }
            );
        }

        // --- Vérifie l’expiration du token ---
        if (new Date(user.reset_token_expires) < new Date()) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.tokenExpired" },
                { status: 400 }
            );
        }

        // --- Hash du nouveau mot de passe ---
        const hashedPassword = await bcrypt.hash(password, 10);

        // --- Mise à jour du mot de passe et suppression du token ---
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { reset_token: "", reset_token_expires: "" },
            }
        );

        return NextResponse.json(
            { message: "auth.reset.form.success" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la réinitialisation :", error);

        if (error instanceof z.ZodError) {
            const issue = error.issues[0];
            return NextResponse.json({ error: issue.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
