import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import logger from "@/lib/logger";

/**
 * GET /api/reviews/[movieId]/mine
 * → Récupère la review du user connecté pour un film donné
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ movieId: string }> }
) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const { movieId } = await context.params;
        const parsedMovieId = parseInt(movieId, 10);
        if (isNaN(parsedMovieId)) {
            return NextResponse.json(
                { error: "review.validation.movieIdInvalid" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();

        const myReview = await db
            .collection<Review>("reviews")
            .findOne({ movieId: parsedMovieId, userId: token.sub });

        return NextResponse.json(myReview ?? null, { status: 200 });
    } catch (err) {
        logger.error({
            route: "/api/reviews/[movieId]/mine",
            message: err instanceof Error ? err.message : "Erreur inconnue",
            stack: err instanceof Error ? err.stack : undefined,
        });
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
