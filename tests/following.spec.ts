import { test, expect } from "@playwright/test";

test.describe("Section Abonnements du profil utilisateur", () => {
    test.beforeEach(async ({ page }) => {
        // --- Connexion ---
        await page.goto("/fr/login");
        await page.fill('input[name="email"]', "alice@example.com");
        await page.fill('input[name="password"]', "securePassword42");
        await page.click('button[type="submit"]');
        await page.waitForURL("**/fr/profile", { timeout: 10000 });
    });

    // =====================================================
    // Test — Ajouter et retirer un utilisateur suivi
    // =====================================================
    test("ajoute un utilisateur à ses abonnements puis se désabonne", async ({ page }) => {
        const pseudo = "user";

        // Vérifier la présence du titre "Abonnements"
        const heading = page.getByRole("heading", { name: /abonnements/i });
        await expect(heading).toBeVisible({ timeout: 10000 });

        // Vérifier le champ texte pour ajouter un pseudo
        const input = page.locator('input[placeholder*="Pseudo" i]');
        await expect(input).toBeVisible({ timeout: 10000 });

        // --- Ajouter un utilisateur ---
        await input.fill(pseudo);

        const followButton = page.getByRole("button", { name: /suivre/i });
        await expect(followButton).toBeVisible({ timeout: 10000 });
        await followButton.click();

        // Vérifier le toast de succès
        const followToast = page.getByText(
            new RegExp(`${pseudo} a été ajouté à vos abonnements`, "i")
        );
        await expect(followToast).toBeVisible({ timeout: 10000 });

        // --- Attendre que la liste se mette à jour ---
        const followedUser = page.locator('ul.space-y-3 li span.font-medium', { hasText: pseudo });
        await expect(followedUser).toBeVisible({ timeout: 10000 });

        // --- Cliquer sur "Se désabonner" ---
        const unfollowButton = page
            .getByRole("button", { name: /se désabonner/i })
            .or(page.getByRole("button", { name: /désabonner/i }))
            .or(page.getByRole("button", { name: /ne plus suivre/i }))
            .first();

        await expect(unfollowButton).toBeVisible({ timeout: 10000 });
        await unfollowButton.click();

        // --- Attendre la modale de confirmation ---
        const modal = page.locator(".bg-slate-900.border.rounded-2xl");
        await expect(modal).toBeVisible({ timeout: 10000 });

        // --- Cliquer sur "Supprimer" dans la modale ---
        const confirmButton = modal.getByRole("button", { name: /^supprimer$/i });
        await expect(confirmButton).toBeVisible({ timeout: 5000 });
        await confirmButton.click();

        // --- Vérifier le toast après désabonnement ---
        const unfollowToast = page.getByText(
            new RegExp(`vous ne suivez plus ${pseudo}`, "i")
        );
        await expect(unfollowToast).toBeVisible({ timeout: 10000 });
    });
});
