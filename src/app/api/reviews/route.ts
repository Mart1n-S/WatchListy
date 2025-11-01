import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { ReviewSchema } from "@/lib/validators/review";
import { ZodError } from "zod";

/**
 * POST /api/reviews
 * Crée une nouvelle review
 */
export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token || !token.sub) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const userId: string = token.sub;
        const body = await request.json();

        const parsed = ReviewSchema.parse({
            ...body,
            userId,
            userName: token.name || "Utilisateur",
            userImage: token.picture ?? null,
        });

        const { db } = await connectToDatabase();

        const existing = await db.collection<Review>("reviews").findOne({
            movieId: parsed.movieId,
            userId,
        });

        if (existing) {
            return NextResponse.json({ error: "review.alreadyExists" }, { status: 409 });
        }

        const now = new Date();
        const newReview: Review = {
            movieId: parsed.movieId,
            userId,
            userName: parsed.userName!,
            userImage: parsed.userImage,
            rating: parsed.rating,
            comment: parsed.comment,
            created_at: now,
            updated_at: now,
        };

        await db.collection("reviews").insertOne(newReview);
        return NextResponse.json(newReview, { status: 201 });
    } catch (err: unknown) {
        console.error("Erreur POST /api/reviews :", err);

        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "review.validation.failed", details: err.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }

}
