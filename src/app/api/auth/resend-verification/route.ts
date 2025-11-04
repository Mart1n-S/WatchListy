import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/emails/sendVerificationEmail";
import crypto from "crypto";
import { ResendSchema } from "@/lib/validators/auth-email";
import logger from "@/lib/logger";

/**
 * POST /api/auth/resend-verification
 * ➜ Renvoyer un e-mail de vérification si l’utilisateur n’est pas encore confirmé
 *    et qu’aucun token de vérification actif n’existe.
 */
export async function POST(req: Request) {
    try {
        const json = await req.json();
        const locale = req.headers.get("accept-language") || "fr";

        // --- Validation via Zod ---
        const result = ResendSchema.safeParse(json);
        if (!result.success) {
            const fieldError = result.error.issues[0];
            return NextResponse.json(
                { error: fieldError.message },
                { status: 400 }
            );
        }

        const { email } = result.data;
        const { db } = await connectToDatabase();

        // --- Recherche de l’utilisateur ---
        const user = await db
            .collection("users")
            .findOne({ email: email.toLowerCase() });

        // Réponse neutre si l’utilisateur n’existe pas
        if (!user) {
            return NextResponse.json(
                { message: "auth.verify.resendNeutral" },
                { status: 200 }
            );
        }

        // Déjà vérifié ?
        if (user.verified_at) {
            return NextResponse.json(
                { error: "auth.verify.errors.emailAlreadyVerified" },
                { status: 400 }
            );
        }

        // --- Vérifie s’il existe déjà un token valide ---
        const existingToken = await db.collection("auth_tokens").findOne({
            userId: user._id,
            type: "verify-email",
            expiresAt: { $gt: new Date() },
        });

        if (existingToken) {
            // Token encore actif → pas de renvoi d’email
            return NextResponse.json(
                { message: "auth.verify.resendNeutral" },
                { status: 200 }
            );
        }

        // --- Génère un nouveau token ---
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(plainToken)
            .digest("hex");

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // --- Stocke le token dans la collection TTL ---
        await db.collection("auth_tokens").insertOne({
            userId: user._id,
            type: "verify-email",
            tokenHash: hashedToken,
            createdAt: new Date(),
            expiresAt,
        });

        // --- Envoi de l’e-mail ---
        await sendVerificationEmail(email, plainToken, locale);

        return NextResponse.json(
            { message: "auth.verify.resendSuccess" },
            { status: 200 }
        );
    } catch (error) {
        logger.error({
            route: "/api/auth/resend-verification",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
