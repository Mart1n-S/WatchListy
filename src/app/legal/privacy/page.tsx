import type { Metadata } from "next";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de WatchListy : quelles données nous collectons, pourquoi, comment nous les protégeons, et quels sont vos droits.",
};

export default function PrivacyPage() {
  return (
    <div className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Version du 9 octobre 2025
          </p>
          <p className="mt-4 text-slate-300 max-w-2xl">
            Nous respectons votre vie privée. Cette page explique quelles données nous collectons, pourquoi nous les utilisons,
            combien de temps nous les conservons, et comment vous pouvez exercer vos droits.
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          {/* 1. Responsable du traitement */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">1) Responsable du traitement</h2>
            <p className="mt-2 text-sm">
              Le responsable du traitement des données est : <strong>WatchListy</strong>.
              <br />
              Contact : <a href="mailto:contact@watchlisty.com" className="text-sky-400 hover:text-sky-300 underline">contact@watchlisty.com</a>
            </p>
          </section>

          {/* 2. Données collectées */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">2) Données collectées</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li><strong>Données de compte :</strong> adresse e‑mail, nom (optionnel), mot de passe (haché).</li>
              <li><strong>Données d’usage :</strong> listes créées, préférences, interactions avec l’application.</li>
              <li><strong>Données de support :</strong> messages envoyés via le formulaire de contact.</li>
            </ul>
          </section>

          {/* 3. Finalités et bases légales */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">3) Finalités et bases légales</h2>
            <p className="mt-2 text-sm">
              Nous traitons vos données pour les finalités suivantes :
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li><strong>Fournir le service :</strong> création et gestion de votre compte (exécution du contrat).</li>
              <li><strong>Amélioration du service :</strong> analyses anonymisées et mesure d’audience (intérêt légitime ou consentement pour certains traceurs).</li>
              <li><strong>Support :</strong> répondre à vos demandes via le formulaire de contact (exécution du contrat / intérêt légitime).</li>
              <li><strong>Sécurité :</strong> prévention des fraudes et protection des comptes (intérêt légitime).</li>
            </ul>
          </section>

          {/* 4. Cookies et traceurs */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">4) Cookies et traceurs</h2>
            <p className="mt-2 text-sm">
              Nous utilisons des cookies strictement nécessaires pour la session et, si vous les acceptez, des cookies de mesure d’audience.
              Vous pouvez gérer vos préférences via le centre de préférences (ou le bandeau de cookies).
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Pour plus de détails, consultez notre <Link href="/legal/cookies" className="text-sky-400 hover:text-sky-300 underline">Politique de cookies</Link>.
            </p>
          </section>

          {/* 5. Destinataires */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">5) Destinataires des données</h2>
            <p className="mt-2 text-sm">
              Vos données peuvent être partagées avec :
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Prestataires techniques (hébergement, monitoring, envoi d’e‑mail) sous contrat de sous-traitance.</li>
              <li>Autorités compétentes si la loi l’exige.</li>
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              Nous exigeons de nos prestataires des garanties de sécurité conformes au RGPD.
            </p>
          </section>

          {/* 6. Transferts hors UE */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">6) Transferts hors Union européenne</h2>
            <p className="mt-2 text-sm">
              Si des données sont transférées hors de l’Union européenne, nous nous assurons qu’un niveau de protection adéquat est garanti
              (clauses contractuelles types, décisions d’adéquation, ou autres garanties conformes au RGPD).
            </p>
          </section>

          {/* 7. Durée de conservation */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">7) Durée de conservation</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Données de compte : conservées tant que le compte existe ou selon obligations légales.</li>
              <li>Données d’usage et journaux : conservés de façon pseudonymisée ou agrégée pendant une durée raisonnable pour les finalités exposées (ex. 12–36 mois selon le type de log).</li>
              <li>Données de contact (support) : conservées pour la tenue du dossier, puis archivées selon les exigences légales.</li>
            </ul>
          </section>

          {/* 8. Sécurité */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">8) Sécurité</h2>
            <p className="mt-2 text-sm">
              Nous mettons en place des mesures techniques et organisationnelles adaptées pour protéger vos données (chiffrement des mots de passe,
              accès restreint, sauvegardes, surveillance des incidents). Malgré cela, aucun système n’est invulnérable : signalez toute anomalie immédiatement.
            </p>
          </section>

          {/* 9. Vos droits */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">9) Vos droits</h2>
            <p className="mt-2 text-sm">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Droit d’accès : obtenir une copie des données que nous détenons vous concernant.</li>
              <li>Droit de rectification : corriger des données inexactes ou incomplètes.</li>
              <li>Droit à l’effacement : demander la suppression de vos données, sous réserve des obligations légales.</li>
              <li>Droit à la limitation du traitement.</li>
              <li>Droit d’opposition au traitement pour motifs légitimes.</li>
              <li>Droit à la portabilité des données, lorsque le traitement est fondé sur votre consentement ou un contrat.</li>
              <li>Droit de retirer votre consentement (lorsque applicable) sans affecter la licéité des traitements antérieurs.</li>
            </ul>
            <p className="mt-2 text-sm">
              Pour exercer vos droits, contactez-nous : <a href="mailto:contact@watchlisty.com" className="text-sky-400 hover:text-sky-300 underline">contact@watchlisty.com</a>.
              Vous pouvez aussi déposer une plainte auprès de l’autorité de contrôle (en France : la CNIL).
            </p>
          </section>

          {/* 10. Modifications de la politique */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">10) Modifications</h2>
            <p className="mt-2 text-sm">
              Nous pouvons mettre à jour cette politique. La date de révision en haut de la page sera modifiée en conséquence.
              En cas de changement substantiel, nous préviendrons les utilisateurs connectés.
            </p>
          </section>

          {/* 11. Contact */}
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">11) Contact</h2>
            <p className="mt-2 text-sm">
              Pour toute question relative à la protection des données, écrivez à :
              <br />
              <a href="mailto:contact@watchlisty.com" className="text-sky-400 hover:text-sky-300 underline">contact@watchlisty.com</a>
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
