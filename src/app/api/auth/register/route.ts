import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RegisterSchema } from "@/lib/validators/register";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

/**
 * POST /api/auth/register
 * Crée un nouvel utilisateur et envoie un e-mail de vérification
 * - Gère la sélection d’un avatar
 * - Gère les genres de films/séries préférés
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

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

        // --- Vérifie si l’email existe déjà ---
        const existingEmail = await db.collection("users").findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return NextResponse.json(
                { error: "auth.register.errors.emailExists" },
                { status: 400 }
            );
        }

        // --- Vérifie si le pseudo existe déjà ---
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

        // --- (Optionnel) Envoi d’un e-mail de vérification ---
        // await sendVerificationEmail(email, verifyToken);

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
