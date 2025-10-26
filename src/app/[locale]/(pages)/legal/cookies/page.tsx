import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies" });

  const getLocalizedPath = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  return (
    <div className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            {t("subtitle")}
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          {/* Section 1: Qu'est-ce qu'un cookie ? */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("definition.title")}</h2>
            <p className="mt-2 text-slate-300">{t("definition.text")}</p>
          </section>

          {/* Section 2: Principe général adopté */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("principles.title")}</h2>
            <p className="mt-2 text-slate-300">{t("principles.intro")}</p>
            <ul className="mt-2 list-disc list-inside text-slate-300 space-y-1">
              {t.raw("principles.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 3: Types de cookies utilisés */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("types.title")}</h2>
            <ul className="mt-2 list-disc list-inside text-slate-300 space-y-2">
              {t.raw("types.items").map((item: { name: string; description: string }, index: number) => (
                <li key={index}>
                  <strong>{item.name}</strong>: {item.description}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4: Exemples */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("examples.title")}</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              {t.raw("examples.items").map((item: { title: string; description: string }, index: number) => (
                <div key={index} className="rounded-md p-3 bg-slate-950/30 border border-slate-800/60">
                  <p className="font-medium text-slate-200">{item.title}</p>
                  <p className="mt-1 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Consentement et gestion */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("consent.title")}</h2>
            <p className="mt-2 text-slate-300">{t("consent.text")}</p>
            <p className="mt-3 text-sm text-slate-400">{t("consent.note")}</p>
          </section>

          {/* Section 6: Comment désactiver les cookies via le navigateur */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("browser.title")}</h2>
            <p className="mt-2 text-slate-300">{t("browser.intro")}</p>
            <ul className="mt-2 list-disc list-inside text-slate-300 space-y-1 text-sm">
              {t.raw("browser.steps").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">{t("browser.warning")}</p>
          </section>

          {/* Section 7: Vos droits */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("rights.title")}</h2>
            <p className="mt-2 text-slate-300">
              {t("rights.text")}{" "}
              <Link href={getLocalizedPath("/contact")} className="text-sky-400 hover:text-sky-300 underline">
                {t("rights.contact")}
              </Link>
              {t("rights.email")}
            </p>
            <p className="mt-2 text-xs text-slate-500">{t("rights.authority")}</p>
          </section>

          {/* Section 8: Mise à jour de la page */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("updates.title")}</h2>
            <p className="mt-2 text-slate-300">{t("updates.text")}</p>
          </section>

          <p className="text-xs text-slate-500">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}