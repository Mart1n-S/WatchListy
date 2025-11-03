import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/emails/sendVerificationEmail";
import crypto from "crypto";
import { ResendSchema } from "@/lib/validators/auth-email";

/**
 * POST /api/auth/resend-verification
 * Renvoyer un e-mail de vérification si l’utilisateur n’est pas encore confirmé
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

        // Token encore valide → ne pas renvoyer d’e-mail pour éviter le spam
        if (
            user.verify_token &&
            user.verify_token_expires &&
            new Date(user.verify_token_expires) > new Date()
        ) {
            return NextResponse.json(
                { message: "auth.verify.resendNeutral" },
                { status: 200 }
            );
        }

        // --- Nouveau token de vérification ---
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(plainToken)
            .digest("hex");

        const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // expire dans 24h

        // --- Mise à jour de l’utilisateur ---
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: {
                    verify_token: hashedToken,
                    verify_token_expires: verifyTokenExpires,
                },
            }
        );

        // --- Envoi de l’e-mail ---
        await sendVerificationEmail(email, plainToken, locale);

        return NextResponse.json(
            { message: "auth.verify.resendSuccess" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors du renvoi d’e-mail de vérification:", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
