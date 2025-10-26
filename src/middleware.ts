import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/locales";

// --- Middleware i18n de base ---
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
});

// --- Middleware principal (fusion i18n + Auth + Cache TMDB) ---
export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    // Ignore les routes API (pas de locale)
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Ignore les fichiers statiques et Next.js internes
    if (
        pathname.startsWith("/_next") ||
        pathname.includes(".") ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    // Gestion spéciale pour TMDB : ajout d’un header cache
    if (pathname.startsWith("/api/tmdb/genres")) {
        const res = NextResponse.next();
        res.headers.set("X-Cache-Layer", "Next-Fetch-Cache");
        console.log("🌀 [Middleware] Requête TMDB interceptée → cache actif");
        return res;
    }

    // Vérifie si une locale est déjà dans l’URL (ex: /fr, /en)
    const hasLocale = locales.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );

    // Si aucune locale → redirige vers la locale par défaut
    if (!hasLocale) {
        req.nextUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(req.nextUrl);
    }

    // Authentification NextAuth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;

    // Déterminer la locale et la route sans préfixe
    const currentLocale = locales.find((locale) =>
        pathname.startsWith(`/${locale}`)
    )!;
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

    const isLoginPage = pathWithoutLocale === "/login";
    const isRegisterPage = pathWithoutLocale === "/register";
    const isProfilePage = pathWithoutLocale.startsWith("/profile");

    // Redirige si utilisateur connecté → évite /login
    if (isAuth && (isLoginPage || isRegisterPage)) {
        return NextResponse.redirect(
            new URL(`/${currentLocale}/profile`, origin)
        );
    }

    // Redirige si utilisateur non connecté → bloque /profile/*
    if (!isAuth && isProfilePage) {
        return NextResponse.redirect(new URL(`/${currentLocale}/login`, origin));
    }

    // Passe la main au middleware i18n pour gestion automatique
    return intlMiddleware(req);
}

// --- Configuration du middleware ---
export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"], // intercepte toutes les routes sauf assets
};
