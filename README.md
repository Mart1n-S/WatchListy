
# 🎬 WatchListy

**WatchListy** est une application web moderne permettant aux utilisateurs de **gérer leurs films et séries préférés**, de **suivre d’autres cinéphiles**, et de **recevoir des recommandations personnalisées** selon leurs goûts.
L’application s’appuie sur l’API [TMDB (The Movie Database)](https://www.themoviedb.org/) pour les données des films et séries, et propose une interface élégante, rapide et responsive.

---

## 📖 Table des matières

1. [Fonctionnalités principales](#-fonctionnalités-principales)
2. [Technologies utilisées](#-technologies-utilisées)
3. [Architecture du projet](#-architecture-du-projet)
4. [Installation et lancement](#-installation-et-lancement)
5. [Seeding des données](#-seeding-des-données)
6. [Internationalisation (i18n)](#-internationalisation-i18n)
7. [Tests](#-tests)
8. [Liens utiles](#-liens-utiles)

---

## 🚀 Fonctionnalités principales

### 🔐 **Authentification et gestion utilisateur**

* Inscription, connexion et déconnexion via **NextAuth**
* Authentification sécurisée par **session**
* Gestion complète du profil utilisateur :

  * Pseudo, avatar, email, préférences de genres
  * Historique d’inscription
* Réinitialisation du mot de passe
* Vérification du compte et gestion des utilisateurs bloqués

---

### 🎥 **Gestion des films et séries**

* Ajout de contenu à différentes listes :

  * **À regarder** 🕒
  * **En cours** ▶️
  * **Terminés** ✅
* Possibilité d’ajouter une **note** et une **critique** personnelle
* Affichage des notes moyennes globales
* Suppression et gestion rapide via modales de confirmation
* Synchronisation automatique entre **frontend et base MongoDB**

---

### 🔍 **Recherche et filtrage avancés**

* Recherche par **titre**
* Filtres :

  * Genre
  * Popularité
  * Date de sortie
  * Note moyenne
* Tri dynamique :

  * Date d’ajout
  * Popularité
  * Note utilisateur

---

### 💬 **Avis et communauté**

* Lecture des **avis des autres utilisateurs** sur les films/séries
* Affichage des **notes individuelles** et de la date de publication
* Page de profil publique pour chaque utilisateur (`/users/[pseudo]`)

---

### 🤝 **Interaction sociale**

* Système de **follow / unfollow** entre utilisateurs
* Liste de vos abonnements
* Comptage dynamique du nombre d’abonnés
* Accès aux profils publics des autres membres

---

### ⚙️ **Préférences et recommandations**

* Choix de vos genres favoris (films et séries)
* Préférences stockées dans le profil utilisateur
---

### 🌐 **Internationalisation (i18n)**

* Application entièrement **multilingue (français / anglais)**
* Gestion via **Next-Intl**
* Traductions dynamiques côté serveur et client

---

### 🔒 **Performance & sécurité**

* API interne sécurisée (route handlers Next.js)
* Stockage sécurisé des mots de passe via **bcrypt**
* Sessions protégées via **NextAuth + cookies HTTPOnly**
* **Caching intelligent** des requêtes TMDB pour limiter les appels
* **Server Side Rendering (SSR)** et **préchargement** des pages critiques

---

## 🛠️ Technologies utilisées

| Catégorie                | Technologies                                                |
| ------------------------ | ----------------------------------------------------------- |
| **Frontend**             | Next.js  (App Router), React 19, TypeScript, Tailwind CSS |
| **Backend**              | API Routes Next.js, MongoDB, Mongoose-like driver           |
| **Auth & sécurité**      | NextAuth, bcrypt, JWT (sessions sécurisées)                 |
| **State Management**     | Redux Toolkit + Thunks                                      |
| **API externe**          | TMDB (The Movie Database)                                   |
| **Internationalisation** | next-intl                                                   |
| **Notifications**        | react-hot-toast                                             |
| **Animations & UI**      | Framer Motion            |
| **Tests**                | Playwright                                                  |
| **Déploiement**          | Compatible Vercel ou Node.js                                |

---

## 🧩 Architecture du projet

```
src/
├── app/                # Routes et pages Next.js (App Router)
│   ├── api/            # API internes sécurisées
│   ├── [locale]/       # Pages traduites (fr/en)
│   └── layout.tsx      # Layout global
│
├── components/         # Composants UI & sections
│   ├── profile/        # Composants liés au profil utilisateur
│   ├── movies/         # Cartes & listes de films/séries
│   ├── ui/             # Modales, backgrounds, boutons…
│   └── layout/         # Header, footer, etc.
│
├── lib/                # Fonctions utilitaires et config
│   ├── redux/          # Redux store, slices et thunks
│   ├── tmdb.ts         # Fonctions d’appel à l’API TMDB
│   └── auth.ts         # NextAuth config
│
├── models/             # Types et modèles MongoDB
└── public/             # Images et assets statiques
```

---

## 📌 Installation et lancement

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/Mart1n-S/WatchListy.git
cd WatchListy
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Configurer les variables d’environnement

Crée un fichier `.env.local` à la racine :

```bash
MONGODB_URI=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
TMDB_API_KEY=...
```

### 4️⃣ Lancer le serveur de développement

```bash
npm run dev
```

### 5️⃣ Construire pour la production

```bash
npm run build
npm start
```

---

## 🌱 Seeding des données

Pour initialiser des utilisateurs de test dans la base de données :

```bash
npm run seed:users
```

---

## 🌍 Internationalisation (i18n)

L’application gère plusieurs langues via **Next-Intl**.
Les fichiers de traduction se trouvent dans :

```
src/messages/
├── fr.json
└── en.json
```

Les namespaces sont organisés par page (ex : `profile`, `layout`, `movies`, etc.).

---

## 🧪 Tests

Lancer les tests E2E avec **Playwright** :

```bash
npx playwright test
```

Générer un rapport interactif :

```bash
npx playwright show-report
```

---

## 🌐 Liens utiles

* [TMDB API](https://developers.themoviedb.org/3)
* [Next.js Documentation](https://nextjs.org/docs)
* [Tailwind CSS](https://tailwindcss.com/docs)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [Next-Intl](https://next-intl-docs.vercel.app/)
* [Playwright Documentation](https://playwright.dev/docs/intro)

---

## 💙 Remerciements

Ce projet a été conçu avec passion par **[Mart1n-S](https://github.com/Mart1n-S)**.
Les données proviennent de [TMDB](https://www.themoviedb.org/), mais WatchListy n’est **ni affilié ni certifié** par TMDB.

---
