import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import Link from "next/link";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-slate-300 max-w-3xl">{t("intro")}</p>
          <p className="mt-2 text-sm text-slate-400">{t("version")}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 space-y-8">
            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">{t("mission.title")}</h2>
              <p className="mt-3 text-slate-300">{t("mission.text")}</p>
            </section>

            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">{t("commitments.title")}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {["privacy", "performance", "accessibility", "transparency"].map((key) => (
                  <li
                    key={key}
                    className="rounded-xl bg-slate-950/40 p-4 border border-slate-800/60"
                  >
                    <p className="font-medium text-slate-200">
                      {t(`commitments.items.${key}.title`)}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {t(`commitments.items.${key}.desc`)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">{t("features.title")}</h2>
              <p className="mt-3 text-slate-300">{t("features.text")}</p>
            </section>

            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">{t("roadmap.title")}</h2>
              <p className="mt-3 text-slate-300">{t("roadmap.text")}</p>
              <p className="mt-4 text-slate-400 text-sm">
                {t("roadmap.contact")}{" "}
                <Link
                  href="/contact"
                  className="text-sky-400 hover:text-sky-300 underline"
                >
                  {t("roadmap.link")}
                </Link>
                .
              </p>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h3 className="text-lg font-semibold text-white">{t("team.title")}</h3>
              <p className="mt-2 text-slate-300 text-sm">
                {t("team.text")}{" "}
                <Link
                  href="/contact"
                  className="text-sky-400 hover:text-sky-300 underline"
                >
                  {t("team.link")}
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
