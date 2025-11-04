import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import logger from "@/lib/logger";

/**
 * GET /api/auth/verify-email/[token]
 * ➜ Vérifie un token de validation d’e-mail via la collection `auth_tokens`
 *    et active le compte utilisateur s’il est valide et non expiré.
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

        // Hache le token reçu pour comparer
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const { db } = await connectToDatabase();

        // Recherche du token actif (non expiré) dans `auth_tokens`
        const tokenDoc = await db.collection("auth_tokens").findOne({
            type: "verify-email",
            tokenHash: hashedToken,
            expiresAt: { $gt: new Date() },
        });

        if (!tokenDoc) {
            return NextResponse.json(
                {
                    status: "error",
                    code: "invalid_or_expired",
                    error: "auth.verify.errors.invalidLink",
                },
                { status: 400 }
            );
        }

        // Recherche de l'utilisateur associé
        const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(tokenDoc.userId) });

        if (!user) {
            return NextResponse.json(
                {
                    status: "error",
                    code: "user_not_found",
                    error: "auth.verify.errors.invalidLink",
                },
                { status: 400 }
            );
        }

        // Déjà vérifié ?
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

        // Active le compte utilisateur
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { verified_at: new Date() } }
        );

        // Supprime le token (bonne pratique : éviter réutilisation)
        await db.collection("auth_tokens").deleteOne({ _id: tokenDoc._id });

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
