import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/emails/sendResetPasswordEmail";
import { ResendSchema } from "@/lib/validators/auth-email";
import logger from "@/lib/logger";

/**
 * POST /api/auth/forgot-password
 * ➜ Génère un token unique de réinitialisation de mot de passe
 *    et l’envoie par e-mail à l’utilisateur.
 */
export async function POST(req: Request) {
    try {
        const json = await req.json();
        const locale = req.headers.get("accept-language") || "fr";

        // --- Validation via Zod ---
        const parsed = ResendSchema.safeParse(json);
        if (!parsed.success) {
            const issue = parsed.error.issues[0];
            return NextResponse.json({ error: issue.message }, { status: 400 });
        }

        const { email } = parsed.data;
        const { db } = await connectToDatabase();

        // --- Recherche de l'utilisateur ---
        const user = await db.collection("users").findOne({
            email: email.toLowerCase(),
        });

        // Réponse neutre (même si pas d'utilisateur)
        if (!user) {
            return NextResponse.json(
                { message: "auth.reset.request.neutral" },
                { status: 200 }
            );
        }

        // --- Vérifie si un token récent existe déjà (anti-spam) ---
        const existingToken = await db.collection("auth_tokens").findOne({
            userId: user._id,
            type: "reset-password",
            expiresAt: { $gt: new Date() },
        });

        if (existingToken) {
            return NextResponse.json(
                { message: "auth.reset.request.neutral" },
                { status: 200 }
            );
        }

        // --- Génération d’un nouveau token sécurisé ---
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(plainToken)
            .digest("hex");

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expire dans 10 minutes

        // --- Sauvegarde dans la collection TTL ---
        await db.collection("auth_tokens").insertOne({
            userId: user._id,
            type: "reset-password",
            tokenHash: hashedToken,
            createdAt: new Date(),
            expiresAt,
        });

        // --- Envoi de l'e-mail ---
        await sendResetPasswordEmail(email, plainToken, locale);

        // Réponse neutre (évite les fuites d’infos)
        return NextResponse.json(
            { message: "auth.reset.request.neutral" },
            { status: 200 }
        );
    } catch (error) {
        logger.error({
            route: "/api/auth/forgot-password",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
