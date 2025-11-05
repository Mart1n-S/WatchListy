import { test, expect } from '@playwright/test';

test.describe('Gestion de la Watchlist', () => {
    // Connexion avant chaque test
    test.beforeEach(async ({ page }) => {
        await page.goto('/fr/login');
        await page.fill('input[name="email"]', 'alice@example.com');
        await page.fill('input[name="password"]', 'securePassword42');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/fr/profile', { timeout: 10000 });
    });

    // =====================================================
    // Test 1 — Ajout d’un film à la Watchlist
    // =====================================================
    test('ajouter un film à la Watchlist depuis la page de détails', async ({ page }) => {
        await page.goto('/fr/movies');

        // Attendre le chargement des MediaCards
        const mediaCards = page.locator('.group.cursor-pointer');
        await expect(mediaCards.first()).toBeVisible({ timeout: 15000 });

        // Cliquer sur la première carte
        await mediaCards.first().click();

        // Attendre la page de détail
        await page.waitForURL(/\/fr\/movies\/\d+$/, { timeout: 10000 });

        // Vérifier le bouton "Ajouter à ma Watchlist"
        const addButton = page.getByRole('button', { name: /ajouter à ma watchlist/i });
        await expect(addButton).toBeVisible({ timeout: 10000 });

        // Cliquer sur le bouton d’ajout
        await addButton.click();

        // Vérifier le toast de succès
        const successToast = page.getByText(/ajouté avec succès à la watchlist/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });
    });

    // =====================================================
    // Test 2 — Suppression d’un film depuis la Watchlist
    // =====================================================
    test('supprimer un film de la Watchlist depuis le profil', async ({ page }) => {
        // Aller sur la page Watchlist
        await page.goto('/fr/profile/watchlist');
        await page.waitForURL('**/fr/profile/watchlist', { timeout: 10000 });

        // Attendre qu'une carte apparaisse
        const userCards = page.locator('.bg-slate-900');
        await expect(userCards.first()).toBeVisible({ timeout: 15000 });

        // Cliquer sur le bouton "Supprimer" de la carte
        const deleteButton = page.locator('button[title="Supprimer"]').first();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click();

        // Attendre la modale de confirmation
        const modal = page.locator('.bg-slate-900.border.rounded-2xl');
        await expect(modal).toBeVisible({ timeout: 10000 });

        // Cibler le bouton "Supprimer" à l’intérieur de la modale uniquement
        const confirmButton = modal.getByRole('button', { name: /^supprimer$/i });
        await expect(confirmButton).toBeVisible({ timeout: 5000 });

        // Cliquer sur "Supprimer" dans la modale
        await confirmButton.click();

        // Vérifier le toast de suppression
        const deleteToast = page.getByText(/élément supprimé avec succès de votre liste/i);
        await expect(deleteToast).toBeVisible({ timeout: 15000 });
    });

    // =====================================================
    // Test 3 — Ajout d’une série à la Watchlist
    // =====================================================
    test('ajouter une série à la Watchlist depuis la page de détails', async ({ page }) => {
        await page.goto('/fr/series');

        // Attendre le chargement des cartes de séries
        const seriesCards = page.locator('.group.cursor-pointer');
        await expect(seriesCards.first()).toBeVisible({ timeout: 15000 });

        // Cliquer sur la première carte de série
        await seriesCards.first().click();

        // Attendre la page de détail de la série
        await page.waitForURL(/\/fr\/series\/\d+$/, { timeout: 10000 });

        // Vérifier la présence du bouton "Ajouter à ma Watchlist"
        const addButton = page.getByRole('button', { name: /ajouter à ma watchlist/i });
        await expect(addButton).toBeVisible({ timeout: 10000 });

        // Cliquer sur le bouton d’ajout
        await addButton.click();

        // Vérifier le toast de succès
        const successToast = page.getByText(/ajouté avec succès à la watchlist/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });
    });

    // =====================================================
    // Test 4 — Suppression d’une série depuis la Watchlist
    // =====================================================
    test('supprimer une série de la Watchlist depuis le profil', async ({ page }) => {
        await page.goto('/fr/profile/watchlist');
        await page.waitForURL('**/fr/profile/watchlist', { timeout: 10000 });

        // Attendre qu'une carte apparaisse (que ce soit un film ou une série)
        const userCards = page.locator('.bg-slate-900');
        await expect(userCards.first()).toBeVisible({ timeout: 15000 });

        // Cliquer sur le bouton "Supprimer" de la première carte
        const deleteButton = page.locator('button[title="Supprimer"]').first();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click();

        // Attendre la modale de confirmation
        const modal = page.locator('.bg-slate-900.border.rounded-2xl');
        await expect(modal).toBeVisible({ timeout: 10000 });

        // Cibler le bouton "Supprimer" dans la modale
        const confirmButton = modal.getByRole('button', { name: /^supprimer$/i });
        await expect(confirmButton).toBeVisible({ timeout: 5000 });

        // Cliquer sur "Supprimer"
        await confirmButton.click();

        // Vérifier le toast de suppression
        const deleteToast = page.getByText(/élément supprimé avec succès de votre liste/i);
        await expect(deleteToast).toBeVisible({ timeout: 15000 });
    });

});
