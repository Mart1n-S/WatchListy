import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/reset-password
 * Réinitialise le mot de passe si le token est valide
 */
export async function POST(req: Request) {
    try {
        const { email, password, confirmPassword, token } = await req.json();

        if (!email || !password || !confirmPassword || !token) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.missingFields" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.passwordMismatch" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();

        const user = await db.collection("users").findOne({
            email: email.toLowerCase(),
            reset_token: token,
        });

        if (!user) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.tokenInvalid" },
                { status: 400 }
            );
        }

        if (new Date(user.reset_token_expires) < new Date()) {
            return NextResponse.json(
                { error: "auth.reset.form.errors.tokenExpired" },
                { status: 400 }
            );
        }

        // Hash du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

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
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
