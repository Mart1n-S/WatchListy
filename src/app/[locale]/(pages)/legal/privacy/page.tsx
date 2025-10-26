import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contact@example.com";
  
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
          <p className="mt-4 text-slate-300 max-w-2xl">
            {t("intro")}
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          {/* 1. Responsable du traitement */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("controller.title")}</h2>
            <p className="mt-2 text-sm">
              {t("controller.text")} <strong>{t("controller.name")}</strong>.
              <br />
              {t("controller.contact")}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          {/* 2. Données collectées */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("data.title")}</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("data.items").map((item: { type: string; description: string }, index: number) => (
                <li key={index}>
                  <strong>{item.type}</strong>: {item.description}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Finalités et bases légales */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("purposes.title")}</h2>
            <p className="mt-2 text-sm">
              {t("purposes.intro")}
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("purposes.items").map((item: { purpose: string; legal: string }, index: number) => (
                <li key={index}>
                  <strong>{item.purpose}</strong>: {item.legal}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Cookies et traceurs */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("cookies.title")}</h2>
            <p className="mt-2 text-sm">
              {t("cookies.text")}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {t("cookies.moreInfo")}{" "}
              <Link href={getLocalizedPath("/legal/cookies")} className="text-sky-400 hover:text-sky-300 underline">
                {t("cookies.link")}
              </Link>.
            </p>
          </section>

          {/* 5. Destinataires */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("recipients.title")}</h2>
            <p className="mt-2 text-sm">
              {t("recipients.intro")}
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("recipients.items").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              {t("recipients.guarantees")}
            </p>
          </section>

          {/* 6. Transferts hors UE */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("transfers.title")}</h2>
            <p className="mt-2 text-sm">
              {t("transfers.text")}
            </p>
          </section>

          {/* 7. Durée de conservation */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("retention.title")}</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("retention.items").map((item: { type: string; duration: string }, index: number) => (
                <li key={index}>
                  <strong>{item.type}</strong>: {item.duration}
                </li>
              ))}
            </ul>
          </section>

          {/* 8. Sécurité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("security.title")}</h2>
            <p className="mt-2 text-sm">
              {t("security.text")}
            </p>
          </section>

          {/* 9. Vos droits */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("rights.title")}</h2>
            <p className="mt-2 text-sm">
              {t("rights.intro")}
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              {t.raw("rights.items").map((item: { name: string; description: string }, index: number) => (
                <li key={index}>
                  <strong>{item.name}</strong>: {item.description}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              {t("rights.contact.text")}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 underline">
                {CONTACT_EMAIL}
              </a>.
              {t("rights.complaint")}
            </p>
          </section>

          {/* 10. Modifications de la politique */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("modifications.title")}</h2>
            <p className="mt-2 text-sm">
              {t("modifications.text")}
            </p>
          </section>

          {/* 11. Contact */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">{t("contact.title")}</h2>
            <p className="mt-2 text-sm">
              {t("contact.text")}
              <br />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 underline">
                {CONTACT_EMAIL}
              </a>
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