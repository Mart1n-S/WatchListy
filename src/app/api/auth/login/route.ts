import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
    const json = await req.json().catch(() => null);

    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
            const k = String(i.path[0]);
            fieldErrors[k] = i.message;
        });
        return NextResponse.json(
            { message: "Champs invalides", code: "VALIDATION_ERROR", fieldErrors },
            { status: 422 }
        );
    }

    const { email, password } = parsed.data;

    // Simulation latence
    await new Promise((r) => setTimeout(r, 900));

    // Démo sans BDD
    const DEMO_EMAIL = "demo@watchlisty.app";
    const DEMO_PASS = "password123";

    if (email !== DEMO_EMAIL || password !== DEMO_PASS) {
        return NextResponse.json(
            { message: "Identifiants invalides", code: "INVALID_CREDENTIALS" },
            { status: 401 }
        );
    }

    // TODO: set cookie de session (auth) quand prêt
    return NextResponse.json({ ok: true });
}
