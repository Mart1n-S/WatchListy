"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Props du composant AuthProvider
 * 
 * @interface AuthProviderProps
 * @property {React.ReactNode} children - Les composants enfants
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Composant AuthProvider - Fournisseur de contexte d'authentification
 * 
 * Ce composant enveloppe l'application avec le SessionProvider de NextAuth.js
 * pour rendre la session d'authentification disponible dans tous les composants enfants.
 * 
 */
export function AuthProvider({ children }: AuthProviderProps) {
  /**
   * Retourne le SessionProvider de NextAuth.js qui fournit :
   * - L'état de session global
   * - Les fonctions de connexion/déconnexion
   * - Le rechargement de session
   * - Les données utilisateur authentifié
   * 
   */
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}