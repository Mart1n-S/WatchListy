import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { randomBytes } from "crypto";
import { sendResetPasswordEmail } from "@/lib/emails/sendResetPasswordEmail";
import { ResendSchema } from "@/lib/validators/auth-email";

/**
 * POST /api/auth/forgot-password
 * Envoie un e-mail de réinitialisation de mot de passe
 */
export async function POST(req: Request) {
    try {
        const json = await req.json();
        const locale = req.headers.get("accept-language") || "fr";

        // Validation de la requête avec Zod
        const parsed = ResendSchema.safeParse(json);
        if (!parsed.success) {
            const issue = parsed.error.issues[0];
            return NextResponse.json({ error: issue.message }, { status: 400 });
        }

        const { email } = parsed.data;
        const { db } = await connectToDatabase();

        // Vérifie si l'utilisateur existe
        const user = await db.collection("users").findOne({ email: email.toLowerCase() });

        // Si aucun utilisateur trouvé → réponse neutre
        if (!user) {
            return NextResponse.json(
                { message: "auth.reset.request.neutral" },
                { status: 200 }
            );
        }

        // Vérifie si un token de réinitialisation est encore valide (10 min)
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

        // Génère un nouveau token
        const resetToken = randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        // Met à jour l'utilisateur
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: {
                    reset_token: resetToken,
                    reset_token_expires: resetTokenExpires,
                },
            }
        );

        // Envoie l'e-mail
        await sendResetPasswordEmail(email, resetToken, locale);

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
