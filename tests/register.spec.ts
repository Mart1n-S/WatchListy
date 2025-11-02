import { test, expect } from '@playwright/test';

// Décrire le contexte des tests pour la page d'inscription
// Ce bloc regroupe tous les tests liés à la page d'inscription
test.describe('Page d’inscription', () => {
    // Test pour vérifier qu'une inscription réussie redirige vers la page de connexion
    test('inscription réussie redirige vers la page de connexion', async ({ page }) => {
        // Naviguer vers la page d'inscription
        await page.goto('/fr/register');

        // Vérifier que le titre de la page d'inscription est visible
        await expect(page.getByRole('heading', { name: /créer un compte/i })).toBeVisible();

        // Générer un email et pseudo aléatoires pour éviter les conflits
        const random = Math.floor(Math.random() * 10000);
        const email = `testuser${random}@example.com`;

        // Remplir les champs du formulaire d'inscription
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="pseudo"]', `User${random}`);
        await page.fill('input[name="password"]', 'Password123!');
        await page.fill('input[name="confirmPassword"]', 'Password123!');

        // Sélectionner un avatar en cliquant sur le premier label visible
        await page.click('label[for="avatar-0"]');

        // Soumettre le formulaire
        await page.click('button[type="submit"]');

        // Attendre la redirection vers la page de connexion
        await page.waitForURL('**/fr/login', { timeout: 15000 });

        // Vérifier que l'URL contient bien '/fr/login'
        expect(page.url()).toContain('/fr/login');

        // Vérifier que le titre de la page de connexion est visible
        await expect(page.getByRole('heading', { name: /se connecter/i })).toBeVisible();
    });
});

test.describe('Page d’inscription', () => {
    test('affiche une erreur si l’email est déjà utilisé', async ({ page }) => {
        // Aller sur la page register
        await page.goto('/fr/register');

        // Vérifier le titre de la page
        await expect(page.getByRole('heading', { name: /créer un compte/i })).toBeVisible();

        // Utiliser un email déjà existant
        await page.fill('input[name="email"]', 'alice@example.com');
        await page.fill('input[name="pseudo"]', 'AliceDupe');
        await page.fill('input[name="password"]', 'Password123!');
        await page.fill('input[name="confirmPassword"]', 'Password123!');

        // Sélectionner le premier avatar (via son label visible)
        await page.click('label[for="avatar-0"]');

        // Soumettre le formulaire
        await page.click('button[type="submit"]');

        // Attendre l’apparition d’un message d’erreur lié à l’email
        const errorEmail = page.locator('p.text-red-300');

        // Vérifier que le message d'erreur est visible
        await expect(errorEmail).toBeVisible();

        // Vérifier que le texte contient "email" ou "existe déjà"
        await expect(errorEmail).toHaveText(/cette adresse e-mail est déjà utilisée/i);

        // Vérifier qu'on reste bien sur la page d'inscription
        expect(page.url()).toContain('/fr/register');
    });
});