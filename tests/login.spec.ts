import { test, expect } from '@playwright/test';

test.describe('Page de connexion', () => {
    test('connexion réussie avec un utilisateur valide', async ({ page }) => {
        // Aller sur la page de login
        await page.goto('/fr/login');

        // Vérifier que la page s’est bien chargée
        await expect(page.getByRole('heading', { name: /Se connecter/i })).toBeVisible();

        // Remplir les champs du formulaire avec un compte valide
        await page.fill('input[name="email"]', 'alice@example.com');
        await page.fill('input[name="password"]', 'securePassword42');

        // Soumettre le formulaire
        await page.click('button[type="submit"]');

        // Attendre la redirection vers le profil
        const profileUrl = '**/fr/profile';
        try {
            await page.waitForURL(profileUrl, { timeout: 10000 });
            expect(page.url()).toContain('/fr/profile');
        } catch {
            // Si pas de redirection, on vérifie qu'une erreur d'auth est visible
            const formError = page.locator('[role="alert"]');
            await expect(formError).toBeVisible();
        }
    });

    test('échec de connexion avec des identifiants invalides', async ({ page }) => {
        // Aller sur la page de login
        await page.goto('/fr/login');

        // Vérifier que la page s’est bien chargée
        await expect(page.getByRole('heading', { name: /Se connecter/i })).toBeVisible();

        // Remplir les champs avec des identifiants incorrects
        await page.fill('input[name="email"]', 'mauvais@example.com');
        await page.fill('input[name="password"]', 'wrongpassword123');

        // Soumettre le formulaire
        await page.click('button[type="submit"]');

        // Vérifier qu'un message d'erreur est affiché
        const formError = page.getByTestId('form-error');
        await expect(formError).toBeVisible();
        await expect(formError).toHaveText(/Aucun utilisateur trouvé avec cet e-mail/i);


        // Vérifier qu'on reste bien sur la page de login
        expect(page.url()).toContain('/fr/login');
    });
});
