import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { ReviewSchema } from "@/lib/validators/review";

/**
 * GET /api/reviews/[movieId]
 * → Récupère toutes les reviews d’un film
 */
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ movieId: string }> }
) {
    // --- Authentification ---
    const token = await getToken({ req: _request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
    }
    try {
        const { movieId } = await context.params;
        const parsedMovieId = parseInt(movieId, 10);

        if (isNaN(parsedMovieId)) {
            return NextResponse.json(
                { error: "review.validation.movieIdInvalid" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const reviews = await db
            .collection<Review>("reviews")
            .find({ movieId: parsedMovieId })
            .sort({ updated_at: -1 })
            .toArray();

        return NextResponse.json(reviews, { status: 200 });
    } catch (err) {
        console.error("Erreur GET /api/reviews/[movieId] :", err);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/reviews/[movieId]
 * → Met à jour la review de l’utilisateur connecté
 */
export async function PATCH(
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

        const body = await request.json();
        const parsed = ReviewSchema.partial().parse(body); // PATCH = champs partiels

        const { db } = await connectToDatabase();

        const update = {
            ...(parsed.comment && { comment: parsed.comment }),
            ...(parsed.rating && { rating: parsed.rating }),
            updated_at: new Date(),
        };

        const result = await db.collection("reviews").findOneAndUpdate(
            { movieId: parsedMovieId, userId: token.sub },
            { $set: update },
            { returnDocument: "after" }
        );

        if (!result.value) {
            return NextResponse.json({ error: "review.notFound" }, { status: 404 });
        }

        return NextResponse.json(result.value, { status: 200 });
    } catch (err) {
        console.error("Erreur PATCH /api/reviews/[movieId] :", err);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/reviews/[movieId]
 * → Supprime la review de l’utilisateur connecté
 */
export async function DELETE(
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
        const result = await db.collection("reviews").deleteOne({
            movieId: parsedMovieId,
            userId: token.sub!,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "review.notFound" }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Erreur DELETE /api/reviews/[movieId] :", err);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
