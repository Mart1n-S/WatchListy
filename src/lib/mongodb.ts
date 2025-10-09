/**
 * Utilitaire de connexion à MongoDB pour Next.js (TypeScript + MongoDB v5+)
 *
 * Ce fichier crée une seule instance de MongoClient et la réutilise
 * entre les appels (idéal pour le développement et les environnements serverless).
 */
import { MongoClient, Db } from "mongodb";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Charger l’URI depuis .env.local
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("La variable d'environnement MONGODB_URI n'est pas définie");
}

/**
 * Déclaration globale pour stocker le cache MongoDB
 * Cela évite de rouvrir plusieurs connexions pendant le développement.
 */
declare global {
    var _mongoCache: {
        client: MongoClient;
        db: Db | null;
    } | undefined;
}

// Initialisation du cache ou récupération du cache existant
const cached = global._mongoCache || {
    client: new MongoClient(uri),
    db: null as Db | null,
};

global._mongoCache = cached;

/**
 * Fonction principale : connexion à MongoDB
 * Si le client n’est pas encore connecté, on l’ouvre une seule fois.
 */
export async function connectToDatabase(dbName?: string) {
    if (!cached.db) {
        // `connect()` est idempotent : il ne relance pas une connexion existante.
        await cached.client.connect();
        console.log("[mongodb] Connecté à MongoDB Atlas");
        cached.db = cached.client.db(dbName);
    }

    return { client: cached.client, db: cached.db };
}

/**
 * Fermer la connexion (utile pour les tests ou le développement local)
 */
export async function closeConnection() {
    if (cached.client) {
        await cached.client.close();
        global._mongoCache = undefined;
        console.log("[mongodb] Connexion fermée");
    }
}
