import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * Route GET de test pour vérifier uniquement la connexion à MongoDB.
 *
 * ➜ Accès : http://localhost:3000/api/db/test
 *
 * Si tout fonctionne, la route renvoie un message de succès.
 */
export async function GET() {
    try {
        // Connexion à la base MongoDB (par défaut la base définie dans ton URI)
        const { db } = await connectToDatabase();

        if (!db) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Connexion OK mais la référence 'db' est nulle.",
                },
                { status: 500 }
            );
        }

        // On fait une lecture sans droits admin : liste des collections
        const collections = await db.listCollections().toArray();

        console.log(`[api/db/test] Connecté à MongoDB — ${collections.length} collections trouvées.`);

        return NextResponse.json(
            {
                ok: true,
                message: "Connexion MongoDB réussie",
                collections: collections.map((c) => c.name),
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("[api/db/test] Erreur de connexion MongoDB :", err);
        return NextResponse.json(
            {
                ok: false,
                error: String(err),
            },
            { status: 500 }
        );
    }
}
