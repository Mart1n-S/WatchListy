import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { ResetPasswordSchema } from "@/lib/validators/resetPassword";
import { z } from "zod";
import logger from "@/lib/logger";

/**
 * POST /api/auth/reset-password
 * ➜ Réinitialise le mot de passe si le token est valide et non expiré
 *    (utilise la collection `auth_tokens` avec TTL).
 */
export async function POST(req: Request) {
    try {
        const json = await req.json();

        // --- Validation du corps de la requête ---
        const parsed = ResetPasswordSchema.safeParse(json);
        if (!parsed.success) {
            const issue = parsed.error.issues[0];
            return NextResponse.json({ error: issue.message }, { status: 400 });
        }

        const { email, password, token } = parsed.data;
        const { db } = await connectToDatabase();

        // --- Hash du token reçu pour comparaison ---
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // --- Recherche du token actif (non expiré) ---
        const tokenDoc = await db.collection("auth_tokens").findOne({
            type: "reset-password",
            tokenHash: hashedToken,
            expiresAt: { $gt: new Date() },
        });

        if (!tokenDoc) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.tokenInvalid" },
                { status: 400 }
            );
        }

        // --- Recherche de l'utilisateur associé ---
        const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(tokenDoc.userId), email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.emailInvalid" },
                { status: 400 }
            );
        }

        // --- Hash du nouveau mot de passe ---
        const hashedPassword = await bcrypt.hash(password, 10);

        // --- Mise à jour du mot de passe ---
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
        );

        // --- Suppression du token (empêche réutilisation) ---
        await db.collection("auth_tokens").deleteOne({ _id: tokenDoc._id });

        return NextResponse.json(
            { message: "auth.reset.form.success" },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issue = error.issues[0];
            return NextResponse.json({ error: issue.message }, { status: 400 });
        }

        logger.error({
            route: "/api/auth/reset-password",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
