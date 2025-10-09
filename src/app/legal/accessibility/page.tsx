import type { Metadata } from "next";
import Link from "next/link";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

export const metadata: Metadata = {
  title: "Déclaration d'accessibilité",
  description: "Déclaration d'accessibilité et informations pour signaler des obstacles sur l'application.",
};


export default function AccessibilityPage() {
  return (
    <main className="relative">
      <BackgroundCinematic />
      <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Déclaration d’accessibilité</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Version du 9 octobre 2025 — Cette page décrit nos engagements en matière d’accessibilité, les limitations actuelles et la manière de signaler un problème.
          </p>
        </header>

        <div className="mt-8 space-y-6 text-slate-300">
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">1) Notre engagement</h2>
            <p className="mt-2 text-slate-300">
              Nous nous efforçons de rendre cette application accessible au plus grand nombre. Nous visons un niveau de conformité WCAG 2.1 AA lorsque cela est raisonnablement possible. Cependant, nous reconnaissons que l’application n’est pas garantie comme 100% accessible aujourd’hui.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">2) Ce qui est déjà mis en place</h2>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              <li>Structure HTML sémantique (titles, headings, lists).</li>
              <li>Navigation clavier pour les éléments principaux (menus, formulaires).</li>
              <li>Contrastes de couleurs testés pour la plupart des composants.</li>
              <li>Attributs alt sur les images informatives lorsque fournis.</li>
              <li>Sémantique ARIA minimale là où nécessaire (rôles et labels).</li>
              <li>Focus visible et gestion basique du focus après interactions majeures.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">3) Limitations connues</h2>
            <p className="mt-2 text-slate-300">
              Malgré nos efforts, nous avons identifié (ou estimons possibles) les limitations suivantes :
            </p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              <li>Composants visuels complexes (graphismes, canvas, animations) pouvant gêner certains lecteurs d’écran ou provoquer des distractions.</li>
              <li>Contenus dynamiques chargés après interaction (modals, contenus asynchrones) pouvant nécessiter des améliorations d’annonces ARIA et de gestion du focus.</li>
              <li>Formulaires complexes où certains labels ou descriptions peuvent manquer ou être insuffisants.</li>
              <li>Multimédia (vidéo/audio) n’a pas systématiquement de sous-titres ou de transcriptions complètes.</li>
              <li>Possibles problèmes de contraste sur des thèmes personnalisés ou avec du contenu utilisateur.</li>
            </ul>
            <p className="mt-2 text-slate-300">
              Si vous rencontrez un obstacle précis, merci de le signaler — voir la section Signaler un problème ci‑dessous.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">4) Comment nous testons</h2>
            <p className="mt-2 text-slate-300">
              Nos tests incluent :
            </p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              <li>Audits automatiques (Lighthouse, axe-core) sur les pages principales.</li>
              <li>Tests manuels au clavier et avec lecteurs d’écran populaires (NVDA, VoiceOver) sur les flux critiques.</li>
              <li>Vérifications de contraste et revue des composants UI.</li>
            </ul>
            <p className="mt-2 text-slate-300">
              Nous conservons les rapports de test et priorisons les corrections en fonction de l’impact utilisateur et de la faisabilité technique.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">5) Feuille de route d’amélioration</h2>
            <ol className="mt-2 list-decimal list-inside text-sm space-y-1 text-slate-300">
              <li>Corriger les problèmes critiques identifiés par axe-core et Lighthouse sur les pages de création et d’inscription.</li>
              <li>Ajouter des annonces ARIA et améliorer la gestion du focus pour les modals et contenus dynamiques.</li>
              <li>Transcrire / sous-titrer le contenu vidéo important.</li>
              <li>Améliorer l’accessibilité des formulaires (labels explicites, erreurs accessibles).</li>
              <li>Effectuer des tests utilisateurs avec personnes en situation de handicap pour les flux essentiels.</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">6) Mesures d’atténuation et conseils</h2>
            <p className="mt-2 text-slate-300">
              En attendant les corrections, voici des astuces pour contourner certains obstacles :
            </p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              <li>Utiliser la navigation par onglets et la recherche du navigateur pour atteindre rapidement des sections.</li>
              <li>Si une image ou un média manque de description, activez le mode lecteur du navigateur ou demandez la transcription via contact.</li>
              <li>Si un formulaire ne met pas le focus sur une erreur, passez directement aux champs requis et utilisez Ctrl/Cmd+F pour trouver les labels.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">7) Signaler un problème</h2>
            <p className="mt-2 text-slate-300">
              Si vous rencontrez un obstacle d’accessibilité, merci de nous transmettre les informations suivantes :
            </p>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              <li>URL (ou étape précise) où le problème apparaît.</li>
              <li>Description du problème et de son impact.</li>
              <li>Système d’exploitation, navigateur et lecteur d’écran (si connu).</li>
              <li>Capture d’écran ou enregistrement si possible.</li>
            </ul>
            <p className="mt-2 text-slate-300">
              Pour signaler : <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline">page Contact</Link> .
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">8) Engagement de réponse</h2>
            <p className="mt-2 text-slate-300">
              Nous accusons réception des signalements sous 5 jours ouvrés et fournissons une réponse ou plan d’action sous 30 jours ouvrés lorsque c’est possible. Si votre signalement nécessite une action urgente (ex. impossibilité totale d’utiliser un flux essentiel), indiquez-le clairement pour priorisation.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">9) Accessibilité technique — points concrets pour les développeurs</h2>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-slate-300">
              <li>Vérifier l’ordre DOM pour respecter l’ordre visuel.</li>
              <li>Ajouter des labels explicites pour tous les contrôles de formulaire.</li>
              <li>Gérer le focus : mettre focus sur les modals ouverts et le remettre lors de la fermeture.</li>
              <li>Utiliser role, aria-label et aria-describedby uniquement quand nécessaire et correctement.</li>
              <li>Fournir des alternatives textuelles pour tout contenu non textuel.</li>
              <li>Éviter les animations excessives ou fournir un moyen de les réduire (prefers-reduced-motion).</li>
            </ul>
          </section>

          <p className="text-xs text-slate-500">
                        Ce document est fourni à titre indicatif et ne remplace pas un avis juridique. Il sert juste pour le projet de cours ESGI tout cela reste à titre d’exemple et fictif.
          </p>
        </div>
      </section>
    </main>
  );
}
