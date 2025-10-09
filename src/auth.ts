import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { LoginSchema } from "@/lib/validators/auth";
import type { UserDocument } from "@/models/User";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Type exact renvoyé par authorize
type AuthUser = {
    id: string;
    email: string;
    pseudo: string;
    avatar: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(raw): Promise<AuthUser | null> {
                const parsed = LoginSchema.safeParse(raw);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;
                const { db } = await connectToDatabase("watchlisty");

                const user = await db
                    .collection<UserDocument>("users")
                    .findOne({ email });

                if (!user) return null;

                const ok = await compare(password, user.password);
                if (!ok) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    pseudo: user.pseudo,
                    avatar: user.avatar,
                };
            },
        }),
    ],
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                const u = user as AuthUser; // vient d'authorize, sûr
                token.id = u.id;
                token.email = u.email;
                token.pseudo = u.pseudo;
                token.avatar = u.avatar;
            }
            return token as JWT;
        },

        async session({ session, token }): Promise<Session> {
            const t = token as JWT;
            // session.user est garanti par l’augmentation de types
            session.user = {
                ...session.user,
                id: t.id,
                email: t.email,
                pseudo: t.pseudo,
                avatar: t.avatar,
            };
            return session;
        },
    },
    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET,
});
