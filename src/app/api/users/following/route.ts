import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import logger from "@/lib/logger";

/**
 * GET /api/users/following
 * Renvoie la liste des utilisateurs suivis (pseudo, avatar, id)
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const { db } = await connectToDatabase();
        const currentUser = await db
            .collection("users")
            .findOne({ _id: new ObjectId(session.user.id) });

        if (!currentUser) {
            return NextResponse.json({ error: "Follow.errors.currentUserNotFound" }, { status: 404 });
        }

        const followingIds = Array.isArray(currentUser.following)
            ? currentUser.following.map((id: unknown) => new ObjectId(id as string))
            : [];

        if (followingIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const followingUsers = await db
            .collection("users")
            .find(
                { _id: { $in: followingIds } },
                { projection: { pseudo: 1, avatar: 1, _id: 1 } }
            )
            .toArray();

        return NextResponse.json(followingUsers, { status: 200 });
    } catch (error) {
        logger.error({
            route: "/api/users/following",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
