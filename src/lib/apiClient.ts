import { LoginSchema, type LoginInput } from "./validators/auth";

type ApiError = {
    message: string;
    code?: string;
    fieldErrors?: Record<string, string>;
    status?: number;
};

async function handle<T>(res: Response): Promise<T> {
    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const hasBody = res.status !== 204 && res.headers.get("content-length") !== "0";
    const data = isJson && hasBody ? await res.json() : null;

    if (!res.ok) {
        const err: ApiError = {
            message: data?.message ?? "Une erreur est survenue. Veuillez réessayer.",
            code: data?.code,
            fieldErrors: data?.fieldErrors,
            status: res.status,
        };
        throw err;
    }
    return (data ?? ({} as T)) as T;
}

// Utilitaire fetch avec timeout + abort
async function request<T>(input: RequestInfo, init?: RequestInit & { timeoutMs?: number }) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), init?.timeoutMs ?? 15000);

    try {
        const res = await fetch(input, {
            ...init,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers ?? {}),
            },
            credentials: "same-origin",
        });
        return handle<T>(res);
    } catch (e: any) {
        if (e.name === "AbortError") {
            const err: ApiError = { message: "La requête a expiré.", code: "TIMEOUT" };
            throw err;
        }
        // Erreurs réseau (offline, DNS, etc.)
        const err: ApiError = { message: "Impossible de contacter le serveur.", code: "NETWORK_ERROR" };
        throw err;
    } finally {
        clearTimeout(id);
    }
}

export async function login(input: LoginInput) {
    const parsed = LoginSchema.parse(input); // garde la validation client
    return request<{ ok: true }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(parsed),
    });
}
