import type { Metadata } from "next";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la mission, les engagements et la feuille de route de WatchListy — la solution pensée pour les passionnés de films et séries.",
};

export default function AboutPage() {
  return (
    <div className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            À propos de WatchListy
          </h1>
          <p className="mt-3 text-slate-300 max-w-3xl">
            WatchListy aide les cinéphiles et les sérievores à organiser, suivre et
            redécouvrir leurs contenus préférés. Notre priorité : proposer une expérience
            rapide, respectueuse de la vie privée et centrée sur l’utilité.
          </p>
          <p className="mt-2 text-sm text-slate-400">Version du 9 octobre 2025</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 space-y-8">
            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">Notre mission</h2>
              <p className="mt-3 text-slate-300">
                Simplifier la gestion de ce que vous souhaitez regarder, faciliter la
                découverte et permettre le partage de recommandations — le tout sans
                sacrifier la performance ni la confidentialité.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">Nos engagements</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                <li className="rounded-xl bg-slate-950/40 p-4 border border-slate-800/60">
                  <p className="font-medium text-slate-200">Respect de la vie privée</p>
                  <p className="text-sm text-slate-400 mt-1">Collecte minimale et contrôle utilisateur.</p>
                </li>
                <li className="rounded-xl bg-slate-950/40 p-4 border border-slate-800/60">
                  <p className="font-medium text-slate-200">Performance</p>
                  <p className="text-sm text-slate-400 mt-1">Interface réactive et optimisée.</p>
                </li>
                <li className="rounded-xl bg-slate-950/40 p-4 border border-slate-800/60">
                  <p className="font-medium text-slate-200">Accessibilité</p>
                  <p className="text-sm text-slate-400 mt-1">Contrastes, navigation clavier et sémantique soignée.</p>
                </li>
                <li className="rounded-xl bg-slate-950/40 p-4 border border-slate-800/60">
                  <p className="font-medium text-slate-200">Transparence</p>
                  <p className="text-sm text-slate-400 mt-1">Documentation claire et mises à jour publiques.</p>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">Produits & fonctionnalités</h2>
              <p className="mt-3 text-slate-300">
                WatchListy propose des listes personnalisées, un suivi d’avancement, des
                notes, et des options de tri/filtrage avancées. L’application est conçue
                pour rester légère et extensible : intégrations et fonctionnalités
                avancées arrivent progressivement.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h2 className="text-xl font-semibold text-white">Feuille de route</h2>
              <p className="mt-3 text-slate-300">
                Notre roadmap priorise les fonctionnalités qui apportent le plus de valeur
                aux utilisateurs tout en restant fidèles à nos principes de confidentialité
                et de performance.
              </p>
              <p className="mt-4 text-slate-400 text-sm">
                Vous souhaitez contribuer ou proposer une idée&nbsp;? Contactez-nous via{" "}
                <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline">
                  la page Contact
                </Link>.
              </p>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
              <h3 className="text-lg font-semibold text-white">Équipe</h3>
              <p className="mt-2 text-slate-300 text-sm">
                Petite équipe produit & tech dédiée à l’expérience utilisateur et à la confidentialité.
                Pour contact commercial ou presse, utilisez la <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline">page Contact</Link>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
