import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { User } from "@/models/User";
import logger from "@/lib/logger";

/**
 * GET /api/users
 * Nécessite d'être authentifié
 * ➜ Renvoie la liste publique des utilisateurs
 * avec pseudo, avatar, date de création, et nombre de likes
 */
export async function GET() {
    try {
        // --- Authentification ---
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const { db } = await connectToDatabase();

        const users = await db
            .collection<User>("users")
            .find(
                {},
                {
                    projection: {
                        _id: 1,
                        pseudo: 1,
                        avatar: 1,
                        created_at: 1,
                        likesReceived: 1,
                    },
                }
            )
            .toArray();

        const formatted = users.map((u) => ({
            _id: u._id.toString(),
            pseudo: u.pseudo,
            avatar: u.avatar,
            created_at: u.created_at,
            likesCount: u.likesReceived?.length ?? 0,
        }));

        formatted.sort((a, b) => b.likesCount - a.likesCount);

        return NextResponse.json({ users: formatted }, { status: 200 });
    } catch (error) {
        logger.error({
            route: "/api/users",
            message: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
