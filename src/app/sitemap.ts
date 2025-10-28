import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://watch-listy-one.vercel.app";

    // Liste des pages avec leurs fréquences et priorités
    const staticPaths = [
        { path: "", freq: "daily", priority: 1.0 }, // Accueil
        { path: "/about", freq: "monthly", priority: 0.8 },
        { path: "/legal/accessibility", freq: "yearly", priority: 0.5 },
        { path: "/legal/cookies", freq: "yearly", priority: 0.5 },
        { path: "/legal/privacy", freq: "yearly", priority: 0.5 },
        { path: "/legal/terms", freq: "yearly", priority: 0.5 },
        { path: "/login", freq: "monthly", priority: 0.7 },
        { path: "/register", freq: "monthly", priority: 0.7 },
        { path: "/resend-verification", freq: "monthly", priority: 0.7 },
        { path: "/verify-email", freq: "monthly", priority: 0.7 },
        { path: "/profile", freq: "weekly", priority: 0.9 },
    ] as const;

    // Locales supportées
    const locales = ["fr", "en"] as const;

    // Génération combinée des routes FR et EN
    const routes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
        staticPaths.map(({ path, freq, priority }) => ({
            url: `${baseUrl}/${locale}${path}`,
            lastModified: new Date(),
            changeFrequency: freq,
            priority,
        }))
    );

    return routes;
}
