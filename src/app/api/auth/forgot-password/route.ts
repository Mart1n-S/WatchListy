import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/emails/sendResetPasswordEmail";
import { ResendSchema } from "@/lib/validators/auth-email";

/**
 * POST /api/auth/forgot-password
 * Envoie un e-mail de réinitialisation de mot de passe.
 */
export async function POST(req: Request) {
    try {
        const json = await req.json();
        const locale = req.headers.get("accept-language") || "fr";

        // --- Validation avec Zod ---
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

        // Réponse neutre si l'utilisateur n'existe pas
        if (!user) {
            return NextResponse.json(
                { message: "auth.reset.request.neutral" },
                { status: 200 }
            );
        }

        // --- Vérifie si un token existe encore et est valide (10 min) ---
        if (
            user.reset_token &&
            user.reset_token_expires &&
            new Date(user.reset_token_expires) > new Date()
        ) {
            return NextResponse.json(
                { message: "auth.reset.request.neutral" },
                { status: 200 }
            );
        }

        // --- Génère un nouveau token ---
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(plainToken)
            .digest("hex");

        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        // --- Met à jour l'utilisateur ---
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: {
                    reset_token: hashedToken,
                    reset_token_expires: resetTokenExpires,
                },
            }
        );

        // --- Envoie de l'e-mail ---
        await sendResetPasswordEmail(email, plainToken, locale);

        return NextResponse.json(
            { message: "auth.reset.request.neutral" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la demande de réinitialisation :", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
