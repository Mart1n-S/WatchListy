import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * GET /api/users/[pseudo]
 * Renvoie le profil public d’un utilisateur
 * + ses listes watchlist / watching / completed
 */
export async function GET(
    _req: Request,
    context: { params: Promise<{ pseudo: string }> }
) {
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
