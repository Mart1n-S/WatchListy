/**
 * Animation "fadeInUp" : Effet d'apparition en fondu + mouvement vers le haut
 * - Utilisation : Appliqué aux éléments individuels (ex : titres, cartes)
 * - `hidden` : État initial (invisible et légèrement décalé vers le bas)
 * - `visible` : État final (opaque et en position normale)
 * - Utilisé avec `initial="hidden"`, `animate="visible"` ou `whileInView="visible"`
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Conteneur avec effet "stagger" : Animation séquentielle des enfants
 * - Utilisation : Appliqué à un conteneur parent (ex : grille de cartes)
 * - `staggerChildren` : Délai entre l'animation de chaque enfant (0.15s)
 * - Requiert `variants={staggerContainer}` sur le parent + `variants={fadeInUp}` sur les enfants
 * - Exemple : Utilisé pour la grille des fonctionnalités
 */
export const staggerContainer = {
  hidden: {}, // État initial (vide, car on anime seulement la transition)
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/**
 * Arrière-plan dégradé radial pour la section héro
 * - `radial-gradient` : Dégradé circulaire depuis le centre
 * - Couleurs :
 *   - Bleu (#2563EB) à 10% d'opacité en haut
 *   - Vert émeraude (#10B981) à 5% d'opacité au milieu
 *   - Transparent en bas
 * - Appliqué via `style={gradientBackground}` sur la section héro
 */
export const gradientBackground = {
  background: "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%)",
};