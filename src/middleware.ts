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

// --- Middleware principal ---
export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    // --- Ignore les fichiers statiques et internes ---
    if (
        pathname.startsWith("/_next") ||
        pathname.includes(".") ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    // --- Gestion des routes API internes ---
    if (pathname.startsWith("/api")) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // --- Cas public : genres (accessible sans auth) ---
        if (pathname.startsWith("/api/tmdb/genres")) {
            const res = NextResponse.next();
            res.headers.set("X-Cache-Layer", "Next-Fetch-Cache");
            return res;
        }

        // --- Autres endpoints TMDB : protégés ---
        if (pathname.startsWith("/api/tmdb")) {
            if (!token) {
                return NextResponse.json(
                    { error: "Accès non autorisé" },
                    { status: 401 }
                );
            }

            const res = NextResponse.next();
            res.headers.set("X-Cache-Layer", "Next-Fetch-Cache");
            return res;
        }

        // --- Autres routes API ---
        return NextResponse.next();
    }

    // --- Vérifie la présence d’une locale ---
    const hasLocale = locales.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );

    if (!hasLocale) {
        req.nextUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(req.nextUrl);
    }

    // --- Vérification de l’authentification ---
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;

    // --- Détermination de la locale et du chemin ---
    const currentLocale =
        locales.find((locale) => pathname.startsWith(`/${locale}`)) ||
        defaultLocale;
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

    const isLoginPage = pathWithoutLocale === "/login";
    const isRegisterPage = pathWithoutLocale === "/register";
    const isProfilePage = pathWithoutLocale.startsWith("/profile");
    const isMoviesPage = pathWithoutLocale.startsWith("/movies");
    const isSeriesPage = pathWithoutLocale.startsWith("/series");
    const isUsersPublicPage = pathWithoutLocale.startsWith("/users");

    // --- Si connecté → bloque login/register ---
    if (isAuth && (isLoginPage || isRegisterPage)) {
        return NextResponse.redirect(new URL(`/${currentLocale}/profile`, origin));
    }

    // --- Si non connecté → bloque profile, movies & series ---
    if (!isAuth && (isProfilePage || isMoviesPage || isSeriesPage || isUsersPublicPage)) {
        return NextResponse.redirect(new URL(`/${currentLocale}/login`, origin));
    }

    // --- Passe la main à l’i18n ---
    return intlMiddleware(req);
}

// --- Configuration du middleware ---
export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"],
};
