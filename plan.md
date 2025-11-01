Parfait—voici un **plan étape-par-étape** clair (sans te noyer de code tout de suite). On déroulera ensuite chaque étape ensemble.

---

# Plan de mise en place — Page Détail Film

## Étape 1 — Endpoint API interne agrégé

**But :** Centraliser toutes les données nécessaires d’un film.

* **Fichier :** `src/app/api/tmdb/movies/[id]/route.ts`
* **Ce que l’endpoint renvoie :**

  * `details` → `/movie/{id}` (title, overview, runtime, genres, posters, …)
  * `credits` → `/movie/{id}/credits` (cast, crew)
  * `videos` → `/movie/{id}/videos` (YouTube trailers)
  * `recommendations` → `/movie/{id}/recommendations` (films liés)
* **Options :** `language` via `?lang=fr|en`, cache `revalidate` (ex: 6–12h).
* **Objectif :** Retourner un JSON typé, propre, prêt à consommer par la page.

---

## Étape 2 — Types & contrat de données

**But :** Eviter le bricolage côté UI.

* **Fichier :** `src/types/tmdb.ts` (ou proche de l’API route)
* **Contenu :**

  * `MovieDetails`, `MovieCredits`, `MovieVideo`, `MovieRecommendation`
  * `MovieFullPayload` (structure de la réponse agrégée)
* **Objectif :** Le composant page ne “devine” rien : il consomme un contrat stable.

---

## Étape 3 — Page serveur Next.js

**But :** Rendu SSR avec i18n.

* **Fichier :** `src/app/[locale]/movies/[id]/page.tsx`
* **Actions :**

  * Lire `params.id` + `params.locale` → `lang` TMDB (`fr-FR` / `en-US`)
  * `fetch` **côté serveur** de l’endpoint interne (avec cache/`revalidate`)
  * Gestion d’erreurs → `notFound()` si TMDB renvoie 404 / contenu vide
* **SEO :** Prévoir `generateMetadata` (titre, description, og:image via poster).

---

## Étape 4 — Squelettes de composants UI

**But :** Découper une page lisible & réutilisable.

* **Dossier :** `src/components/movies/detail/`

  * `MovieHeader.tsx` → affiche : poster/backdrop, titre, tagline, note ⭐, durée, genres, date, actions (ex: “Ajouter à Watchlist” plus tard)
  * `MovieOverview.tsx` → synopsis + infos techniques (langue originale, pays, status)
  * `MovieCast.tsx` → casting principal (photo, nom, rôle)
  * `MovieVideos.tsx` → trailers (YouTube embed)
  * `MovieRecommendations.tsx` → grille/carrousel de films recommandés
* **Objectif :** Chaque bloc reçoit juste ce qu’il lui faut (props typées).

---

## Étape 5 — Layout & accessibilité de la page

**But :** Un affichage agréable sur mobile & desktop.

* **Contenu :**

  * Hero avec backdrop (blur/dégradé), poster fixe à gauche sur desktop
  * Grille responsive (2 colonnes desktop / 1 colonne mobile)
  * Textes lisibles (contraste), `aria-label` pour les actions (icônes)
* **Détails UX :**

  * `next/image` optimisé, `priority` pour le poster si above-the-fold
  * Placeholders skeleton (optionnel) via `loading.tsx`

---

## Étape 6 — Lien de navigation & intégration

**But :** Connecter avec ta grille actuelle.

* **Action :** Les cartes `MovieCard` pointent déjà vers `/${locale}/movies/${id}`
* **Plus :** Dans `MovieRecommendations`, réutiliser `MovieCard` (ou version light)

---

## Étape 7 — États de repli & erreurs

**But :** Page robuste.

* **Cas à gérer :**

  * Pas de `videos` → masquer la section trailers
  * Pas de `recommendations` → masquer la section
  * Pas de `poster_path` → placeholder “Pas d’affiche” / “No poster”
* **UI :** Messages localisés (namespace `movies.detail.*`)

---

## Étape 8 — i18n des libellés & formats

**But :** Cohérence FR/EN.

* **Namespace :** `movies.detail`
* **Clés :** “Cast”, “Overview”, “Runtime”, “Genres”, “Release date”, “Trailer(s)”, “Recommendations”
* **Formats :** Date (locale), durée en `Xh YYmin` (fonction util)

---

## Étape 9 — Performance & cache

**But :** Rapide et peu coûteux.

* **API interne :** `revalidate: 43200` (12h) et `Cache-Control` s-maxage
* **Images :** `remotePatterns` pour `image.tmdb.org`
* **Lazy sections :** Cast/Recommandations/Videos chargées en dessous (opti UX)

---

## Étape 10 — Checklist finale

* [ ] Endpoint `/api/tmdb/movies/[id]` ok + tests `fr/en`
* [ ] Page `[id]/page.tsx` SSR + `generateMetadata`
* [ ] UI composants branchés & typés
* [ ] États vides & erreurs gérés
* [ ] i18n done
* [ ] LCP correct (priority sur l’affiche)
* [ ] Liens depuis recommandations fonctionnels

---

Si ça te va, on commence par **l’Étape 1 (endpoint agrégé)**.
Je te fournis le code du routeur API propre et typé, prêt à coller.
