import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET /api/users/followers/count
 * → Renvoie le nombre de personnes qui suivent l’utilisateur connecté
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "common.errors.unauthorized" }, { status: 401 });
        }

        const { db } = await connectToDatabase();

        // Compter combien de users ont ton ID dans leur tableau `following`
        const followersCount = await db
            .collection("users")
            .countDocuments({ following: { $in: [new ObjectId(session.user.id)] } });

        return NextResponse.json({ count: followersCount }, { status: 200 });
    } catch (error) {
        console.error("Erreur /api/users/followers/count :", error);
        return NextResponse.json(
            { error: "common.errors.internalServerError" },
            { status: 500 }
        );
    }
}
