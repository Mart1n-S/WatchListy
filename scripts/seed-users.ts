import { connectToDatabase } from "../src/lib/mongodb";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";
import { UserDocument, UserInput } from "@/models/User";

// Genres de TMDB (extraits de ta réponse API)
const movieGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Aventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comédie" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drame" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science-Fiction" },
];

const tvGenres = [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comédie" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drame" },
    { id: 9648, name: "Mystère" },
    { id: 10765, name: "Science-Fiction & Fantastique" },
];

// Fonction pour tirer quelques genres aléatoires
function getRandomGenres(list: { id: number }[], count: number) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((g) => g.id);
}

const avatars = ["avatar1.svg", "avatar2.svg", "avatar3.svg", "avatar4.svg", "avatar5.svg"];

const users: UserInput[] = [
    { pseudo: "user", email: "user@example.com", password: "password", avatar: avatars[0] },
    { pseudo: "Alice42", email: "alice@example.com", password: "securePassword42", avatar: avatars[1] },
    { pseudo: "BobTheBuilder", email: "bob@example.com", password: "build123", avatar: avatars[2] },
    { pseudo: "CharlieBrown", email: "charlie@example.com", password: "peanuts456", avatar: avatars[3] },
    { pseudo: "DianaPrince", email: "diana@example.com", password: "wonderWoman789", avatar: avatars[4] },
];

async function seedUsers() {
    let connection;
    try {
        const { db, client } = await connectToDatabase("watchlisty_recette");
        connection = client;

        await db.collection("users").createIndex({ email: 1 }, { unique: true });
        await db.collection("users").createIndex({ pseudo: 1 }, { unique: true });

        for (let i = 0; i < users.length; i++) {
            const userInput = users[i];
            const hashedPassword = await hash(userInput.password, 10);

            const user: UserDocument = {
                _id: new ObjectId(),
                pseudo: userInput.pseudo,
                email: userInput.email.toLowerCase(),
                password: hashedPassword,
                avatar: userInput.avatar,
                created_at: new Date(),
                verified_at: new Date(),
                blocked_at: null,
                role: i === 0 ? "admin" : "user",
                preferences: {
                    movies: getRandomGenres(movieGenres, 3),
                    tv: getRandomGenres(tvGenres, 2),
                },
                following: [],
            };

            const result = await db.collection("users").insertOne(user);
            console.log(`✅ Utilisateur ${user.pseudo} inséré avec l'_id: ${result.insertedId}`);
        }

        console.log("🌱 Seed des utilisateurs terminé avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors du seed des utilisateurs:", error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
            console.log("🔒 Connexion MongoDB fermée.");
        }
    }
}

seedUsers().catch(console.error);
