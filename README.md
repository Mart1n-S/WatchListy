# WatchListy 🎬

**WatchListy** est une application web permettant aux utilisateurs de suivre leurs films et séries préférés, de créer des listes personnalisées et de recevoir des recommandations basées sur leurs goûts.  
L’application utilise l’API externe [TMDB (The Movie Database)](https://www.themoviedb.org/) pour récupérer les informations sur les films et séries.

---

## 🚀 Fonctionnalités principales

### **Authentification et gestion utilisateur**
- Inscription / connexion (email + mot de passe, OAuth possible)  
- Réinitialisation de mot de passe  
- Gestion du profil utilisateur (avatar, pseudo, bio)  
- Historique de visionnage  

### **Gestion des films/séries**
- Ajouter des films/séries à différentes listes :  
  - “À regarder”  
  - “Regardés”  
  - “Favoris”  
- Retirer un film/série d’une liste  
- Marquer un film comme “vu” ou “en cours de visionnage”  
- Ajouter des notes ou critiques personnelles  
- Visualiser la note moyenne globale des utilisateurs  

### **Filtrage et recherche**
- Recherche par titre, acteur, réalisateur  
- Filtrage par :  
  - Genre  
  - Popularité  
  - Date de sortie  
  - Note  
- Tri par :  
  - Date d’ajout  
  - Note utilisateur  
  - Popularité  


### **Interaction sociale (optionnel)**
- Commentaires sur les films/séries  
- Suivre d’autres utilisateurs  
- Voir les listes de films d’amis  
- Notifications quand un ami note un film  

### **Performance et sécurité**
- API interne sécurisée avec JWT ou session sécurisée  
- Gestion sécurisée des mots de passe  
- Caching des requêtes TMDB pour limiter les appels API  
- Préchargement côté serveur (SSR) pour les pages critiques

---

## 🛠️ Technologies utilisées
- **Next.js** (React, SSR, API Routes)  
- **TypeScript** pour typage strict et sécurité  
- **Tailwind CSS** pour le style et responsive design  
- **TMDB API** pour les films et séries  
- **JWT / bcrypt** pour l’authentification sécurisée  
- **MongoDB** pour la base de données 

---

## 🧩 Structure recommandée
- `pages/` : pages Next.js  
- `components/` : composants réutilisables (Listes, Cards, Modals…)  
- `hooks/` : hooks personnalisés (useAuth, useMovies…)  
- `lib/` : fonctions utilitaires (API calls, gestion TMDB, helpers…)  
- `store/` : gestion du state global si nécessaire  
- `styles/` : fichiers CSS / Tailwind config  
- `types/` : types TypeScript pour l’API et les modèles  

## 📌 Lancement du projet

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
npm start
```
---

## 🌐 Liens utiles

* [TMDB API](https://developers.themoviedb.org/3)
* [Next.js Documentation](https://nextjs.org/docs)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---
