import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import logger from "@/lib/logger";

/**
 * GET /api/auth/verify-email/[token]
 * Vérifie le token de validation d’e-mail (haché en base) et active le compte si valide
 */
export async function GET(
    _req: Request,
    context: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await context.params;

        if (!token) {
            return NextResponse.json(
                {
                    status: "error",
                    code: "missing",
                    error: "auth.verify.errors.tokenMissing",
                },
                { status: 400 }
            );
        }

        // Hachage du token reçu (pour comparaison)
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const { db } = await connectToDatabase();

        // Recherche de l’utilisateur avec le token haché
        const user = await db
            .collection("users")
            .findOne({ verify_token: hashedToken });

        if (!user) {
            return NextResponse.json(
                {
                    status: "error",
                    code: "invalid",
                    error: "auth.verify.errors.invalidLink",
                },
                { status: 400 }
            );
        }

        // Vérifie l'expiration du token
        if (new Date(user.verify_token_expires) < new Date()) {
            return NextResponse.json(
                {
                    status: "error",
                    code: "expired",
                    error: "auth.verify.errors.expiredLink",
                },
                { status: 400 }
            );
        }

        // Déjà vérifié
        if (user.verified_at) {
            return NextResponse.json(
                {
                    status: "error",
                    code: "emailAlreadyVerified",
                    error: "auth.verify.errors.emailAlreadyVerified",
                },
                { status: 400 }
            );
        }

        // Met à jour l’utilisateur : e-mail confirmé
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: { verified_at: new Date() },
                $unset: { verify_token: "", verify_token_expires: "" },
            }
        );

        return NextResponse.json(
            {
                status: "success",
                message: "auth.verify.success",
            },
            { status: 200 }
        );
    } catch (error) {
        logger.error({
            route: "/api/auth/verify-email/[token]",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            {
                status: "error",
                error: "common.errors.internalServerError",
            },
            { status: 500 }
        );
    }
}
