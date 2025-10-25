import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accessibility.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AccessibilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accessibility" });

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
          {/* Section 1: Notre engagement */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("commitment.title")}</h2>
            <p className="mt-2 text-slate-300">{t("commitment.text")}</p>
          </section>

          {/* Section 2: Ce qui est déjà mis en place */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("implemented.title")}</h2>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              {t.raw("implemented.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 3: Limitations connues */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("limitations.title")}</h2>
            <p className="mt-2 text-slate-300">{t("limitations.intro")}</p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              {t.raw("limitations.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-slate-300">{t("limitations.report")}</p>
          </section>

          {/* Section 4: Comment nous testons */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("testing.title")}</h2>
            <p className="mt-2 text-slate-300">{t("testing.intro")}</p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              {t.raw("testing.methods").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-slate-300">{t("testing.conclusion")}</p>
          </section>

          {/* Section 5: Feuille de route d'amélioration */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("roadmap.title")}</h2>
            <ol className="mt-2 list-decimal list-inside text-sm space-y-1 text-slate-300">
              {t.raw("roadmap.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </section>

          {/* Section 6: Mesures d'atténuation */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("mitigation.title")}</h2>
            <p className="mt-2 text-slate-300">{t("mitigation.intro")}</p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              {t.raw("mitigation.tips").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 7: Signaler un problème */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("reporting.title")}</h2>
            <p className="mt-2 text-slate-300">{t("reporting.intro")}</p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              {t.raw("reporting.info").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-slate-300">
              {t("reporting.contact.text")}{" "}
              <Link href={getLocalizedPath("/contact")} className="text-sky-400 hover:text-sky-300 underline">
                {t("reporting.contact.link")}
              </Link>
              .
            </p>
          </section>

          {/* Section 8: Engagement de réponse */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("response.title")}</h2>
            <p className="mt-2 text-slate-300">{t("response.text")}</p>
          </section>

          {/* Section 9: Accessibilité technique */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("technical.title")}</h2>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              {t.raw("technical.points").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <p className="text-xs text-slate-500">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}