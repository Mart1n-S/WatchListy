import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * GET /api/auth/verify-email?token=xxxx
 * Vérifie le token de validation d’e-mail et active le compte si valide
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

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

        const { db } = await connectToDatabase();

        // Recherche l'utilisateur avec ce token
        const user = await db.collection("users").findOne({ verify_token: token });

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
        console.error("Erreur lors de la vérification d’e-mail:", error);
        return NextResponse.json(
            {
                status: "error",
                error: "common.errors.internalServerError",
            },
            { status: 500 }
        );
    }
}
