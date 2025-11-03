import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId, UpdateFilter } from "mongodb";
import type { User } from "@/models/User";
/**
 * GET /api/users/[pseudo]
 * Renvoie le profil public d’un utilisateur
 * + ses listes watchlist / watching / completed
 */
export async function GET(
    _req: Request,
    context: { params: Promise<{ pseudo: string }> }
) {
    // --- Authentification ---
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
    }

    try {
        const { db } = await connectToDatabase();
        const { pseudo } = await context.params;

        // Récupère l'utilisateur public (sans infos sensibles)
        const user = await db.collection("users").findOne(
            { pseudo },
            {
                projection: {
                    password: 0,
                    email: 0,
                    following: 0,
                },
            }
        );

        if (!user) {
            return NextResponse.json(
                { error: "Follow.errors.userNotFound" },
                { status: 404 }
            );
        }

        // userId est une string dans `user_movies`
        const userIdString = user._id.toString();

        // Récupère tous les contenus de cet utilisateur
        const userMovies = await db
            .collection("user_movies")
            .find({ userId: userIdString })
            .toArray();

        // Classe les contenus par statut
        const watchlist = userMovies.filter((m) => m.status === "watchlist");
        const watching = userMovies.filter((m) => m.status === "watching");
        const completed = userMovies.filter((m) => m.status === "completed");

        // Nettoyage du JSON renvoyé
        return NextResponse.json(
            {
                user: {
                    _id: user._id.toString(),
                    pseudo: user.pseudo,
                    avatar: user.avatar,
                    created_at: user.created_at,
                    preferences: user.preferences,
                    likesCount: user.likesReceived?.length || 0,
                },
                lists: {
                    watchlist: watchlist.map((m) => ({
                        itemId: m.itemId,
                        itemType: m.itemType,
                        status: m.status,
                    })),
                    watching: watching.map((m) => ({
                        itemId: m.itemId,
                        itemType: m.itemType,
                        status: m.status,
                    })),
                    completed: completed.map((m) => ({
                        itemId: m.itemId,
                        itemType: m.itemType,
                        status: m.status,
                    })),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur /api/users/[pseudo] :", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/users/[pseudo]
 * → Like / Unlike la watchlist d’un utilisateur
 */
export async function PATCH(
    _req: Request,
    context: { params: Promise<{ pseudo: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const currentUserId = new ObjectId(session.user.id);
        const { db } = await connectToDatabase();
        const { pseudo } = await context.params;

        const targetUser = await db.collection<User>("users").findOne({ pseudo });
        if (!targetUser) {
            return NextResponse.json(
                { error: "Follow.errors.userNotFound" },
                { status: 404 }
            );
        }

        const targetUserId = targetUser._id as ObjectId;

        if (targetUserId.equals(currentUserId)) {
            return NextResponse.json(
                { error: "Like.errors.cannotLikeYourself" },
                { status: 400 }
            );
        }

        const alreadyLiked = (targetUser.likesReceived ?? []).some((id) =>
            id.equals(currentUserId)
        );

        const updateQuery = (alreadyLiked
            ? { $pull: { likesReceived: currentUserId } }
            : { $addToSet: { likesReceived: currentUserId } }) as UpdateFilter<User>;

        const updatedUser = await db
            .collection<User>("users")
            .findOneAndUpdate(
                { _id: targetUserId },
                updateQuery,
                { returnDocument: "after" }
            );

        const likesCount = updatedUser.value?.likesReceived?.length ?? 0;

        return NextResponse.json({
            liked: !alreadyLiked,
            likesCount,
        });
    } catch (error) {
        console.error("Erreur PATCH /api/users/[pseudo] :", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}