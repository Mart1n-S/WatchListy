import { connectToDatabase } from "../src/lib/mongodb";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";
import { UserDocument, UserInput } from "@/models/User";

// Liste des avatars disponibles
const avatars = [
    "avatar1.svg",
    "avatar2.svg",
    "avatar3.svg",
    "avatar4.svg",
    "avatar5.svg",
];

// Liste des utilisateurs à insérer
const users: UserInput[] = [
    {
        pseudo: "user",
        email: "user@example.com",
        password: "password",
        avatar: avatars[0],
    },
    {
        pseudo: "Alice42",
        email: "alice@example.com",
        password: "securePassword42",
        avatar: avatars[1],
    },
    {
        pseudo: "BobTheBuilder",
        email: "bob@example.com",
        password: "build123",
        avatar: avatars[2],
    },
    {
        pseudo: "CharlieBrown",
        email: "charlie@example.com",
        password: "peanuts456",
        avatar: avatars[3],
    },
    {
        pseudo: "DianaPrince",
        email: "diana@example.com",
        password: "wonderWoman789",
        avatar: avatars[4],
    },
];

async function seedUsers() {
    let connection;
    try {
        // Étendre connectToDatabase pour retourner aussi la connexion
        const { db, client } = await connectToDatabase("watchlisty");
        connection = client;

        // Créer la collection (MongoDB la crée automatiquement à l'insertion)
        await db.createCollection("users");

        // Créer un index unique sur l'email
        await db.collection("users").createIndex({ email: 1 }, { unique: true });

        // Créer un index unique sur le pseudo
        await db.collection("users").createIndex({ pseudo: 1 }, { unique: true });

        // Insérer les utilisateurs
        for (let i = 0; i < users.length; i++) {
            const userInput = users[i];

            // Hacher le mot de passe
            const hashedPassword = await hash(userInput.password, 10);

            // Créer un utilisateur avec les champs par défaut
            const user: UserDocument = {
                _id: new ObjectId(), // Généré automatiquement par MongoDB
                pseudo: userInput.pseudo,
                email: userInput.email,
                password: hashedPassword,
                avatar: userInput.avatar,
                created_at: new Date(),
                verified_at: i === 0 ? new Date() : null, // Vérifié uniquement pour le premier utilisateur
                blocked_at: null,
                role: "user",
                // Pas de preferences pour l'instant
            };

            // Insérer l'utilisateur dans la base de données
            const result = await db.collection("users").insertOne(user);
            console.log(`Utilisateur inséré avec l'_id: ${result.insertedId}`);
        }

        console.log("Seed des utilisateurs terminé avec succès !");
    } catch (error) {
        console.error("Erreur lors du seed des utilisateurs:", error);
        throw error;
    } finally {
        // Fermer la connexion dans le bloc finally pour s'assurer qu'elle est fermée même en cas d'erreur
        if (connection) {
            await connection.close();
            console.log("Connexion à MongoDB fermée.");
        }
    }
}

seedUsers().catch(console.error);
