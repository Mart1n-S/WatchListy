import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RegisterSchema } from "@/lib/validators/register";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/emails/sendVerificationEmail";

/**
 * POST /api/auth/register
 * Crée un nouvel utilisateur et envoie un e-mail de vérification
 * - Gère la sélection d’un avatar
 * - Gère les genres de films/séries préférés
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Récupère la langue depuis le header
        const locale = req.headers.get("accept-language") || "fr";

        // Validation du schéma Zod
        const parsed = RegisterSchema.safeParse(body);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as string;
                fieldErrors[key] = issue.message;
            });

            return NextResponse.json(
                { error: "auth.register.errors.invalidFields", errors: fieldErrors },
                { status: 400 }
            );
        }

        const { email, pseudo, password, avatar, preferences } = parsed.data;

        // --- Connexion à la base ---
        const { db } = await connectToDatabase();

        // Vérifie email existant
        const existingEmail = await db.collection("users").findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return NextResponse.json(
                { error: "auth.register.errors.emailExists" },
                { status: 400 }
            );
        }

        // Vérifie pseudo existant
        const existingPseudo = await db.collection("users").findOne({ pseudo });
        if (existingPseudo) {
            return NextResponse.json(
                { error: "auth.register.errors.pseudoExists" },
                { status: 400 }
            );
        }

        // --- Hachage du mot de passe ---
        const hashedPassword = await hash(password, 10);

        // --- Génération du token de vérification ---
        const verifyToken = randomBytes(32).toString("hex");
        const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // expire dans 24h

        // --- Création du nouvel utilisateur ---
        const newUser = {
            email: email.toLowerCase(),
            pseudo,
            password: hashedPassword,
            avatar: avatar || "avatar1.svg",
            role: "user",
            preferences: preferences || { movies: [], tv: [] },
            created_at: new Date(),
            verified_at: null,
            blocked_at: null,
            verify_token: verifyToken,
            verify_token_expires: verifyTokenExpires,
        };

        await db.collection("users").insertOne(newUser);

        // --- Envoi d’un e-mail de vérification ---
        try {
            // Passe la locale à la fonction email
            await sendVerificationEmail(email, verifyToken, locale);
        } catch (error) {
            console.error("Erreur lors de l’envoi de l’e-mail de vérification :", error);
            return NextResponse.json(
                { error: "auth.register.errors.emailSendFailed" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "auth.register.success" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur dans /api/auth/register :", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
