import { test, expect } from '@playwright/test';

test.describe('Navigation après connexion', () => {
    test('un utilisateur connecté peut accéder à la page des films et voir la barre de recherche', async ({ page }) => {
        // Aller sur la page de connexion
        await page.goto('/fr/login');

        // Vérifier que la page de connexion est bien affichée
        await expect(page.getByRole('heading', { name: /se connecter/i })).toBeVisible();

        // Remplir le formulaire de connexion avec un compte valide
        await page.fill('input[name="email"]', 'alice@example.com');
        await page.fill('input[name="password"]', 'securePassword42');

        // Soumettre le formulaire
        await page.click('button[type="submit"]');

        // Attendre la redirection vers la page profil
        await page.waitForURL('**/fr/profile', { timeout: 10000 });
        expect(page.url()).toContain('/fr/profile');

        // Naviguer vers la page des films
        await page.goto('/fr/movies');

        // Vérifier que la page "films" est bien chargée
        await expect(page).toHaveURL(/\/fr\/movies$/);

        // Vérifier la présence de la barre de recherche
        // On vérifie que l'input a bien l'id "movie-search" (défini dans MediaSearchBar)
        const searchInput = page.locator('input#movie-search');
        await expect(searchInput).toBeVisible();

        // Vérifier que le bouton "Rechercher" est visible
        const searchButton = page.getByRole('button', { name: /rechercher/i });
        await expect(searchButton).toBeVisible();
    });
});
