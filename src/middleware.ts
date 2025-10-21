import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    // Récupère le token NextAuth (si existant)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;
    const isAuthPage = pathname === "/login";

    // Si utilisateur déjà connecté → redirige hors de /login
    if (isAuth && isAuthPage) {
        return NextResponse.redirect(new URL("/profile", origin));
    }

    // Si non connecté et tente d'accéder à /profile/*
    if (!isAuth && pathname.startsWith("/profile")) {
        return NextResponse.redirect(new URL("/login", origin));
    }

    //  DEV : ajout d'un header de debug/cache sur le endpoint TMDB
    if (pathname.startsWith("/api/tmdb/genres")) {
        const res = NextResponse.next();
        res.headers.set("X-Cache-Layer", "Next-Fetch-Cache");
        console.log("🌀 [Middleware] Requête TMDB interceptée → cache actif");
        return res;
    }

    // Si tout est bon
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/login",
        "/api/tmdb/genres",
    ],
};
