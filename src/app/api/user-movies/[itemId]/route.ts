import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import type { UserMovie } from "@/models/UserMovie";
import { z } from "zod";
import { UserMovieSchema } from "@/lib/validators/userMovie";
import logger from "@/lib/logger";

const StatusSchema = UserMovieSchema.pick({ status: true });

/**
 * GET /api/user-movies/[itemId]
 * ➜ Récupère l’entrée user_movie d’un contenu pour l’utilisateur connecté.
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await context.params;

    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const parsedId = Number.parseInt(itemId, 10);
        if (!Number.isInteger(parsedId)) {
            return NextResponse.json({ error: "userMovies.validation.itemIdInvalid" }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const entry = await db.collection<UserMovie>("user_movies").findOne({
            userId: token.sub,
            itemId: parsedId,
        });

        if (!entry) {
            return NextResponse.json({ error: "userMovies.notFound" }, { status: 404 });
        }

        return NextResponse.json(entry, { status: 200 });
    } catch (error) {
        logger.error({
            route: "/api/user-movies/[itemId]",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: "common.errors.internalServerError" }, { status: 500 });
    }
}

/**
 * PATCH /api/user-movies/[itemId]
 * ➜ Met à jour le statut d’un contenu (watchlist → watching → completed, etc.)
 */
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await context.params;

    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = StatusSchema.parse(body); // Validation Zod uniquement sur status

        const parsedId = Number.parseInt(itemId, 10);
        if (!Number.isInteger(parsedId)) {
            return NextResponse.json({ error: "userMovies.validation.itemIdInvalid" }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        const result = await db.collection<UserMovie>("user_movies").findOneAndUpdate(
            { userId: token.sub, itemId: parsedId },
            { $set: { status: parsed.status, updated_at: new Date() } },
            { returnDocument: "after" }
        );

        if (!result.value) {
            return NextResponse.json({ error: "userMovies.notFound" }, { status: 404 });
        }

        return NextResponse.json(result.value, { status: 200 });
    } catch (error) {

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "userMovies.validation.failed" }, { status: 400 });
        }
        logger.error({
            route: "/api/user-movies/[itemId]",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: "common.errors.internalServerError" }, { status: 500 });
    }
}

/**
 * DELETE /api/user-movies/[itemId]
 * ➜ Supprime un contenu de la liste de l’utilisateur
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await context.params;

    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const parsedId = Number.parseInt(itemId, 10);
        if (!Number.isInteger(parsedId)) {
            return NextResponse.json({ error: "userMovies.validation.itemIdInvalid" }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const result = await db.collection<UserMovie>("user_movies").deleteOne({
            userId: token.sub,
            itemId: parsedId,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "userMovies.notFound" }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        logger.error({
            route: "/api/user-movies/[itemId]",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: "common.errors.internalServerError" }, { status: 500 });
    }
}
