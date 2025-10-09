import type { Metadata } from "next";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Informations sur les cookies utilisés par WatchListy et comment gérer vos préférences.",
};

export default function CookiesPage() {
  return (
    <div className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Cookies</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Version du 9 octobre 2025 — Cette page décrit les cookies et autres traceurs utilisés par WatchListy,
            pourquoi nous les utilisons et comment gérer vos préférences.
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">1) Qu’est‑ce qu’un cookie ?</h2>
            <p className="mt-2 text-slate-300">
              Un cookie est un petit fichier texte stocké par votre navigateur. Il peut être utilisé pour
              faire fonctionner le site, mémoriser des préférences ou mesurer l’usage.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">2) Principe général adopté</h2>
            <p className="mt-2 text-slate-300">
              Pour ce projet de cours nous :
            </p>
            <ul className="mt-2 list-disc list-inside text-slate-300 space-y-1">
              <li>Ne transférons pas de données en dehors de l’Union européenne.</li>
              <li>N’activons pas de cookies tiers de suivi sans consentement explicite.</li>
              <li>Laissons l’utilisateur contrôler ses préférences via une bannière / panneau de préférences.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">3) Types de cookies utilisés</h2>
            <ul className="mt-2 list-disc list-inside text-slate-300 space-y-2">
              <li>
                <strong>Cookies strictement nécessaires :</strong> session (authentification côté serveur), préférences d’affichage.
              </li>
              <li>
                <strong>Cookies de performance :</strong> mesures anonymisées pour améliorer l’app (activés uniquement si consentement).
              </li>
              <li>
                <strong>Cookies fonctionnels / tiers optionnels :</strong> ex. services de partage ou CMP (Axeptio) — activés après consentement.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">4) Exemples</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div className="rounded-md p-3 bg-slate-950/30 border border-slate-800/60">
                <p className="font-medium text-slate-200">Session (cookie serveur)</p>
                <p className="mt-1 text-slate-400">
                  Finalité : maintenir la session utilisateur (connexion). Type : cookie HttpOnly recommandé.
                  Durée : session ou durée définie côté serveur (ex. 7 jours).
                </p>
              </div>

              <div className="rounded-md p-3 bg-slate-950/30 border border-slate-800/60">
                <p className="font-medium text-slate-200">CMP (ex. Axeptio) — optionnel</p>
                <p className="mt-1 text-slate-400">
                  Finalité : gestion du consentement. Durée : dépend du fournisseur. À activer uniquement si utilisé.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">5) Consentement et gestion</h2>
            <p className="mt-2 text-slate-300">
              À la première visite, une bannière permet d’accepter/refuser les cookies non‑nécessaires. Les choix sont enregistrés
              (ex. cookie technique ou localStorage) et peuvent être modifiés via le centre de préférences.
            </p>

            <p className="mt-3 text-sm text-slate-400">
              Remarque technique : n’injecte pas de scripts tiers (analytics, widgets) tant que le consentement correspondant n’a pas été donné.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">6) Comment désactiver les cookies via le navigateur</h2>
            <p className="mt-2 text-slate-300">
              Vous pouvez configurer votre navigateur pour refuser les cookies. Voici les chemins généraux (varient selon versions) :
            </p>
            <ul className="mt-2 list-disc list-inside text-slate-300 space-y-1 text-sm">
              <li>Chrome : Paramètres → Confidentialité et sécurité → Cookies.</li>
              <li>Firefox : Options → Vie privée et sécurité → Cookies et données de sites.</li>
              <li>Safari : Préférences → Confidentialité → Bloquer tous les cookies.</li>
              <li>Edge : Paramètres → Cookies et autorisations de site.</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">La désactivation peut affecter certaines fonctionnalités.</p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">7) Vos droits</h2>
            <p className="mt-2 text-slate-300">
              Vous pouvez retirer votre consentement, demander l’accès ou la suppression de vos données. Pour cela, utilisez la{" "}
              <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline">page Contact</Link> ou l’email indiqué dans la Politique de confidentialité.
            </p>
            <p className="mt-2 text-xs text-slate-500">En France, l’autorité compétente est la CNIL.</p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">8) Mise à jour de la page</h2>
            <p className="mt-2 text-slate-300">
              Nous pouvons modifier cette page. La date de révision en haut de la page sera mise à jour en conséquence.
            </p>
          </section>

          <p className="text-xs text-slate-500">
                        Ce document est fourni à titre indicatif et ne remplace pas un avis juridique. Il sert juste pour le projet de cours ESGI tout cela reste à titre d’exemple et fictif.
          </p>
        </div>
      </section>
    </div>
  );
}
