import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import type { UserMovie } from "@/models/UserMovie";
import { UserMovieSchema } from "@/lib/validators/userMovie";

/**
 * GET /api/user-movies
 * ➜ Récupère toutes les entrées user_movies de l’utilisateur connecté
 */
export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const { db } = await connectToDatabase();
        const movies = await db
            .collection<UserMovie>("user_movies")
            .find({ userId: token.sub })
            .sort({ updated_at: -1 })
            .toArray();

        return NextResponse.json(movies, { status: 200 });
    } catch (error) {
        console.error("Erreur GET /api/user-movies :", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/user-movies
 * ➜ Ajoute un film/série à la liste de l'utilisateur
 */
export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        // --- Validation Zod
        const body = await request.json();
        const parsed = UserMovieSchema.parse(body);

        const { db } = await connectToDatabase();

        // --- Vérifie si l'élément existe déjà
        const existing = await db.collection<UserMovie>("user_movies").findOne({
            userId: token.sub,
            itemId: parsed.itemId,
            itemType: parsed.itemType,
        });

        if (existing) {
            return NextResponse.json({ error: "userMovies.alreadyExists" }, { status: 409 });
        }

        const now = new Date();
        const newEntry: UserMovie = {
            userId: token.sub,
            itemId: parsed.itemId,
            itemType: parsed.itemType,
            status: parsed.status,
            created_at: now,
            updated_at: now,
        };

        await db.collection<UserMovie>("user_movies").insertOne(newEntry);
        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        console.error("Erreur POST /api/user-movies :", error);

        if (error instanceof Error && "issues" in error) {
            // Erreur de validation Zod
            return NextResponse.json(
                { error: "userMovies.validation.failed", details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
