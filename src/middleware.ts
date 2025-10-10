import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token }) {
                return !!token;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

// Ce bloc gère la redirection propre sans callbackUrl
export const config = {
    matcher: ["/profile/:path*"],
};
