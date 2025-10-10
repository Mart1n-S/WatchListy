import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Route API NextAuth - Point d'entrée pour toutes les routes d'authentification
 */
const handler = NextAuth(authOptions);

// Exporte les méthodes HTTP supportées par NextAuth
export { handler as GET, handler as POST };