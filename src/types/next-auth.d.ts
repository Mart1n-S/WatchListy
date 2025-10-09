import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        pseudo: string;
        avatar: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            pseudo: string;
            avatar: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        pseudo: string;
        avatar: string;
    }
}

export { };
