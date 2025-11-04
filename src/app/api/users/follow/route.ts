import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { followSchema } from "@/lib/validators/followSchema";
import { ObjectId } from "mongodb";
import type { ZodError } from "zod";
import logger from "@/lib/logger";

/**
 * Gère le suivi et le désabonnement d’un utilisateur.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = followSchema.safeParse(body);

        if (!parsed.success) {
            const zodError = parsed.error as ZodError;
            const fieldErrors: Record<string, string> = {};

            zodError.issues.forEach((issue) => {
                const key = issue.path[0] as string;
                fieldErrors[key] = issue.message;
            });

            return NextResponse.json(
                { error: "Follow.errors.invalidData", errors: fieldErrors },
                { status: 400 }
            );
        }

        const { pseudo } = parsed.data;
        const { db } = await connectToDatabase();

        const currentUser = await db
            .collection("users")
            .findOne({ _id: new ObjectId(session.user.id) });

        if (!currentUser) {
            return NextResponse.json({ error: "Follow.errors.currentUserNotFound" }, { status: 404 });
        }

        const targetUser = await db.collection("users").findOne({ pseudo });
        if (!targetUser) {
            return NextResponse.json({ error: "Follow.errors.userNotFound" }, { status: 404 });
        }

        if (targetUser._id.equals(currentUser._id)) {
            return NextResponse.json({ error: "Follow.errors.selfFollow" }, { status: 400 });
        }

        // Ajout si non déjà suivi
        await db.collection("users").updateOne(
            { _id: currentUser._id },
            { $addToSet: { following: targetUser._id } }
        );

        const updated = await db.collection("users").findOne({ _id: currentUser._id });
        return NextResponse.json({ following: updated?.following ?? [] }, { status: 200 });
    } catch (error) {
        logger.error({
            route: "/api/users/follow [POST]",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: "common.errors.internalServerError" }, { status: 500 });
    }
}

/**
 * DELETE → Se désabonner d’un utilisateur par ID
 */
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Follow.errors.invalidUserId" }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const currentUser = await db
            .collection("users")
            .findOne({ _id: new ObjectId(session.user.id) });

        if (!currentUser) {
            return NextResponse.json({ error: "Follow.errors.currentUserNotFound" }, { status: 404 });
        }

        await db.collection("users").updateOne(
            { _id: currentUser._id },
            { $pull: { following: new ObjectId(userId) } }
        );

        const updated = await db.collection("users").findOne({ _id: currentUser._id });
        return NextResponse.json({ following: updated?.following ?? [] }, { status: 200 });
    } catch (error) {
        logger.error({
            route: "/api/users/follow [DELETE]",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json({ error: "common.errors.internalServerError" }, { status: 500 });
    }
}
