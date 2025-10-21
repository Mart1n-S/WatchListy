import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Vérifie bien ce chemin !
import { connectToDatabase } from "@/lib/mongodb";
import { updateUserSchema } from "@/lib/validators/user";
import { hash, compare } from "bcryptjs";
import { ObjectId } from "mongodb";

/**
 * PATCH /api/user/update
 * Permet à l'utilisateur connecté de modifier :
 *  - pseudo
 *  - avatar
 *  - préférences
 *  - mot de passe (avec vérification de l'ancien)
 */
export async function PATCH(req: Request) {
    try {
        /** Vérification de la session utilisateur */
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        /** Conversion du string ID en ObjectId MongoDB */
        let userId: ObjectId;
        try {
            userId = new ObjectId(session.user.id);
        } catch {
            return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 400 });
        }

        /** Lecture et validation du corps de la requête */
        const body = await req.json();
        const parsed = updateUserSchema.safeParse(body);

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as string;
                fieldErrors[key] = issue.message;
            });
            return NextResponse.json(
                { error: "Données invalides", errors: fieldErrors },
                { status: 400 }
            );
        }

        const { pseudo, avatar, preferences, oldPassword, newPassword } = parsed.data;

        /** Connexion à MongoDB */
        const { db } = await connectToDatabase();
        const user = await db.collection("users").findOne({ _id: userId });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        }

        /** Préparation des champs à mettre à jour */
        const updateData: Record<string, unknown> = {};

        if (pseudo && pseudo !== user.pseudo) updateData.pseudo = pseudo;
        if (avatar && avatar !== user.avatar) updateData.avatar = avatar;
        if (preferences) updateData.preferences = preferences;

        /** Si changement de mot de passe */
        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) {
                return NextResponse.json(
                    { error: "Les champs de mot de passe sont incomplets." },
                    { status: 400 }
                );
            }

            const validOldPassword = await compare(oldPassword, user.password);
            if (!validOldPassword) {
                return NextResponse.json(
                    { errors: { oldPassword: "L'ancien mot de passe est incorrect." } },
                    { status: 400 }
                );
            }

            const hashed = await hash(newPassword, 10);
            updateData.password = hashed;
        }

        /** Aucune donnée à mettre à jour */
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "Aucune donnée à mettre à jour." }, { status: 400 });
        }

        /** Mise à jour en base et récupération du document mis à jour */
        const result = await db.collection("users").findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!result.value) {
            return NextResponse.json({ error: "Échec de la mise à jour." }, { status: 500 });
        }

        /** Nettoyage des données avant réponse */
        const updatedUser = {
            id: result.value._id.toString(),
            name: result.value.pseudo,
            email: result.value.email,
            image: result.value.avatar,
            role: result.value.role,
            createdAt: result.value.created_at,
            preferences: result.value.preferences,
        };

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Erreur dans /api/user/update :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
