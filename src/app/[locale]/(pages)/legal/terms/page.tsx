import type { Metadata } from "next";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d’utilisation",
  description:
    "Conditions d’utilisation de WatchListy : règles d’accès, d’usage, propriété intellectuelle, responsabilité, confidentialité et contact.",
};

export default function TermsPage() {
  return (
    <div className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Conditions d’utilisation
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Version du 9 octobre 2025
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          {/* 1. Objet */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">1) Objet</h2>
            <p className="mt-2">
              Les présentes Conditions d’utilisation (les « Conditions ») régissent l’accès et l’usage de l’application
              WatchListy (le « Service »). En accédant au Service, vous acceptez ces Conditions.
            </p>
          </section>

          {/* 2. Définitions */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">2) Définitions</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li><span className="font-medium text-slate-200">Utilisateur</span> : toute personne accédant au Service.</li>
              <li><span className="font-medium text-slate-200">Contenu</span> : toute information (texte, image, liste, lien) publiée via le Service.</li>
              <li><span className="font-medium text-slate-200">Compte</span> : espace personnel permettant d’utiliser des fonctionnalités.</li>
            </ul>
          </section>

          {/* 3. Acceptation & modifications */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">3) Acceptation et modifications</h2>
            <p className="mt-2">
              L’utilisation du Service vaut acceptation des Conditions. Nous pouvons les modifier à tout moment.
              En cas de changement substantiel, une notification pourra être affichée dans l’application. La poursuite
              de l’usage après publication vaut acceptation des Conditions révisées.
            </p>
          </section>

          {/* 4. Éligibilité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">4) Éligibilité</h2>
            <p className="mt-2">
              Le Service est réservé aux personnes de 16 ans et plus. Si vous avez entre 16 et 18 ans, vous déclarez
              utiliser le Service avec l’accord d’un représentant légal.
            </p>
          </section>

          {/* 5. Compte & sécurité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">5) Compte et sécurité</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Vous devez fournir des informations exactes et les maintenir à jour.</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée via votre compte.</li>
              <li>Prévenez‑nous immédiatement en cas d’usage non autorisé.</li>
            </ul>
          </section>

          {/* 6. Utilisation acceptable */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">6) Utilisation acceptable</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Ne pas enfreindre la loi ni les droits de tiers (droits d’auteur, marques, vie privée).</li>
              <li>Ne pas publier de contenus illégaux, offensants, haineux, ou trompeurs.</li>
              <li>Ne pas tenter d’accéder sans autorisation au Service ou à ses systèmes.</li>
              <li>Ne pas scraper massivement ni surcharger l’infrastructure.</li>
            </ul>
          </section>

          {/* 7. Contenu utilisateur */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">7) Contenu utilisateur</h2>
            <p className="mt-2">
              Vous restez propriétaire de votre Contenu. Vous nous concédez une licence mondiale, non exclusive,
              gratuite et révocable pour héberger, afficher et distribuer votre Contenu dans le seul but d’exploiter le Service.
              Vous garantissez disposer des droits nécessaires sur le Contenu publié.
            </p>
          </section>

          {/* 8. Propriété intellectuelle de WatchListy */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">8) Propriété intellectuelle</h2>
            <p className="mt-2">
              Le Service, sa charte graphique, ses logos, son code et bases de données sont protégés.
              Toute reproduction, modification ou exploitation non autorisée est interdite.
            </p>
          </section>

          {/* 9. Services tiers & liens */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">9) Services tiers et liens</h2>
            <p className="mt-2">
              Le Service peut contenir des liens vers des sites tiers. Nous n’endossons pas leur contenu et
              n’assumons aucune responsabilité quant à leurs pratiques. Vérifiez toujours leurs propres conditions.
            </p>
          </section>

          {/* 10. Confidentialité & cookies */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">10) Confidentialité et cookies</h2>
            <p className="mt-2">
              Vos données sont traitées conformément à notre{" "}
              <Link href="/legal/privacy" className="text-sky-400 hover:text-sky-300 underline">
                Politique de confidentialité
              </Link>{" "}
              et à notre{" "}
              <Link href="/legal/cookies" className="text-sky-400 hover:text-sky-300 underline">
                Politique de cookies
              </Link>.
            </p>
          </section>

          {/* 11. Disponibilité & maintenance */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">11) Disponibilité et maintenance</h2>
            <p className="mt-2">
              Nous visons une haute disponibilité mais ne pouvons la garantir. Le Service peut être interrompu
              pour maintenance, mise à jour ou incident technique.
            </p>
          </section>

          {/* 12. Responsabilité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">12) Responsabilité</h2>
            <p className="mt-2">
              Le Service est fourni « en l’état ». Dans la mesure permise par la loi, notre responsabilité
              est limitée aux dommages directs et prévisibles. Nous ne saurions être tenus responsables des
              pertes indirectes, de données ou d’usage.
            </p>
          </section>

          {/* 13. Résiliation */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">13) Résiliation</h2>
            <p className="mt-2">
              Vous pouvez supprimer votre Compte à tout moment. Nous pouvons suspendre ou résilier l’accès en cas
              de violation des présentes Conditions ou pour des raisons de sécurité.
            </p>
          </section>

          {/* 14. Droit applicable & litiges */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">14) Droit applicable et litiges</h2>
            <p className="mt-2">
              Les présentes Conditions sont régies par le droit français. En cas de litige, une solution amiable sera
              recherchée avant toute action. À défaut, les tribunaux compétents seront ceux déterminés par la loi.
            </p>
          </section>

          {/* 15. Contact */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">15) Contact</h2>
            <p className="mt-2">
              Pour toute question, vous pouvez nous écrire via la{" "}
              <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline">
                page Contact
              </Link>.
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
