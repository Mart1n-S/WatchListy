import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

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
          <p className="mt-3 text-slate-400 text-sm">
            {t("version")}
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          {/* 1. Objet */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("object.title")}</h2>
            <p className="mt-2">
              {t("object.text")}
            </p>
          </section>

          {/* 2. Définitions */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("definitions.title")}</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("definitions.items").map((item: { term: string; definition: string }, index: number) => (
                <li key={index}>
                  <span className="font-medium text-slate-200">{item.term}</span>: {item.definition}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Acceptation & modifications */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("acceptance.title")}</h2>
            <p className="mt-2">
              {t("acceptance.text")}
            </p>
          </section>

          {/* 4. Éligibilité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("eligibility.title")}</h2>
            <p className="mt-2">
              {t("eligibility.text")}
            </p>
          </section>

          {/* 5. Compte & sécurité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("account.title")}</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("account.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* 6. Utilisation acceptable */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("usage.title")}</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("usage.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* 7. Contenu utilisateur */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("content.title")}</h2>
            <p className="mt-2">
              {t("content.text")}
            </p>
          </section>

          {/* 8. Propriété intellectuelle de WatchListy */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("intellectual.title")}</h2>
            <p className="mt-2">
              {t("intellectual.text")}
            </p>
          </section>

          {/* 9. Services tiers & liens */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("thirdparty.title")}</h2>
            <p className="mt-2">
              {t("thirdparty.text")}
            </p>
          </section>

          {/* 10. Confidentialité & cookies */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("privacy.title")}</h2>
            <p className="mt-2">
              {t("privacy.text")}{" "}
              <Link href={getLocalizedPath("/legal/privacy")} className="text-sky-400 hover:text-sky-300 underline">
                {t("privacy.policy")}
              </Link>{" "}
              {t("privacy.and")}{" "}
              <Link href={getLocalizedPath("/legal/cookies")} className="text-sky-400 hover:text-sky-300 underline">
                {t("privacy.cookies")}
              </Link>.
            </p>
          </section>

          {/* 11. Disponibilité & maintenance */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("availability.title")}</h2>
            <p className="mt-2">
              {t("availability.text")}
            </p>
          </section>

          {/* 12. Responsabilité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("liability.title")}</h2>
            <p className="mt-2">
              {t("liability.text")}
            </p>
          </section>

          {/* 13. Résiliation */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("termination.title")}</h2>
            <p className="mt-2">
              {t("termination.text")}
            </p>
          </section>

          {/* 14. Droit applicable & litiges */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("law.title")}</h2>
            <p className="mt-2">
              {t("law.text")}
            </p>
          </section>

          {/* 15. Contact */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("contact.title")}</h2>
            <p className="mt-2">
              {t("contact.text")}{" "}
              <Link href={getLocalizedPath("/contact")} className="text-sky-400 hover:text-sky-300 underline">
                {t("contact.link")}
              </Link>.
            </p>
          </section>

          <p className="text-xs text-slate-500">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}