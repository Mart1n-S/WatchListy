import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === "/login";

    // Si l'utilisateur est connecté et essaie d'accéder à /login
    if (isAuth && isAuthPage) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
    if (!isAuth && req.nextUrl.pathname.startsWith("/profile")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/login"
    ],
};