import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./locales";

export default getRequestConfig(async ({ locale }) => {
    // Si la locale est inconnue ou absente, on prend la valeur par défaut
    const baseLocale = (locale ?? defaultLocale) as string;

    // Vérifie et convertit en type `Locale`
    const validLocale: Locale = locales.includes(baseLocale as Locale)
        ? (baseLocale as Locale)
        : defaultLocale;

    return {
        locale: validLocale,
        messages: (await import(`../app/[locale]/messages/${validLocale}.json`)).default,
    };
});
