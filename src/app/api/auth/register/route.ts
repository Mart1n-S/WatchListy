import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RegisterSchema } from "@/lib/validators/register";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/emails/sendVerificationEmail";
import logger from "@/lib/logger";

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

        // --- Connexion DB ---
        const { db } = await connectToDatabase();

        // Vérifie doublons
        const [existingEmail, existingPseudo] = await Promise.all([
            db.collection("users").findOne({ email: email.toLowerCase() }),
            db.collection("users").findOne({ pseudo }),
        ]);

        if (existingEmail) {
            return NextResponse.json(
                { error: "auth.register.errors.emailExists" },
                { status: 400 }
            );
        }

        if (existingPseudo) {
            return NextResponse.json(
                { error: "auth.register.errors.pseudoExists" },
                { status: 400 }
            );
        }

        // --- Hash du mot de passe ---
        const hashedPassword = await hash(password, 10);

        // --- Génération du token de vérification ---
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(plainToken)
            .digest("hex");

        const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

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
            verify_token: hashedToken, // token haché en base
            verify_token_expires: verifyTokenExpires,
        };

        await db.collection("users").insertOne(newUser);

        // --- Envoi d’un e-mail de vérification ---
        try {
            await sendVerificationEmail(email, plainToken, locale);
        } catch (error) {
            logger.error({
                route: "/api/auth/register",
                message: error instanceof Error ? error.message : "Erreur inconnue",
                stack: error instanceof Error ? error.stack : undefined,
            });
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
        logger.error({
            route: "/api/auth/register",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
