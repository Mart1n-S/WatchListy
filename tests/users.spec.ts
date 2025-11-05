import { test, expect } from "@playwright/test";

test.describe("Page Utilisateurs - Classement et interactions", () => {
    test.beforeEach(async ({ page }) => {
        // Connexion avant chaque test
        await page.goto("/fr/login");
        await page.fill('input[name="email"]', "alice@example.com");
        await page.fill('input[name="password"]', "securePassword42");
        await page.click('button[type="submit"]');
        await page.waitForURL("**/fr/profile", { timeout: 10000 });
    });

    // =====================================================
    // Test complet — Accès, vérifications et interactions
    // =====================================================
    test("affiche la page des utilisateurs, puis interagit avec un profil", async ({ page }) => {
        await page.goto("/fr/users");

        // Vérifier le titre principal
        const heading = page.getByRole("heading", {
            name: "Classement des Watchlist les plus likées",
        });
        await expect(heading).toBeVisible({ timeout: 10000 });

        // Vérifier qu’au moins un utilisateur est affiché
        const firstUser = page.locator("ul li a").first();
        await expect(firstUser).toBeVisible({ timeout: 15000 });

        // Récupérer dynamiquement le pseudo
        const pseudo =
            (await firstUser.locator("p.text-gray-100").textContent())?.trim() ??
            "Utilisateur";

        // Cliquer sur ce profil
        await firstUser.click();

        // Attendre la navigation vers la page utilisateur
        await page.waitForURL(/\/fr\/users\/[^/]+$/, { timeout: 10000 });

        // Vérifier que le titre du profil correspond au pseudo
        const userHeading = page.getByRole("heading", {
            name: new RegExp(pseudo, "i"),
        });
        await expect(userHeading).toBeVisible({ timeout: 10000 });

        // =====================================================
        // J'AIME : LIKE PUIS UNLIKE
        // =====================================================

        const likeButton = page
            .locator("button")
            .filter({ hasText: /j.?aime/i })
            .first();
        await expect(likeButton).toBeVisible({ timeout: 10000 });

        // Compteur initial
        const initialText = await likeButton.locator("span").innerText();
        const initialCount = parseInt(initialText, 10) || 0;

        // 1) Cliquer pour AJOUTER le like (compteur doit augmenter de 1)
        await likeButton.click();

        await expect
            .poll(
                async () => {
                    const txt = await likeButton.locator("span").innerText();
                    const num = parseInt(txt, 10) || 0;
                    return num;
                },
                { timeout: 5000, intervals: [500, 1000] }
            )
            .toBe(initialCount + 1);

        // 2) Cliquer à nouveau pour RETIRER le like (compteur doit revenir à la valeur initiale)
        await likeButton.click();

        await expect
            .poll(
                async () => {
                    const txt = await likeButton.locator("span").innerText();
                    const num = parseInt(txt, 10) || 0;
                    return num;
                },
                { timeout: 5000, intervals: [500, 1000] }
            )
            .toBe(initialCount);


        // =====================================================
        // SUIVRE / NE PLUS SUIVRE
        // =====================================================

        // Cliquer sur "Suivre"
        const followButton = page
            .locator("button")
            .filter({ hasText: /^suivre$/i })
            .first();
        await expect(followButton).toBeVisible({ timeout: 10000 });
        await followButton.click();

        // Toast après suivi
        const followToast = page.getByText(
            new RegExp(`${pseudo} a été ajouté à vos abonnements`, "i")
        );
        await expect(followToast).toBeVisible({ timeout: 10000 });

        // Cliquer sur "Ne plus suivre"
        const unfollowButton = page
            .locator("button")
            .filter({ hasText: /ne plus suivre/i })
            .first();
        await expect(unfollowButton).toBeVisible({ timeout: 10000 });
        await unfollowButton.click();

        const unfollowToast = page.getByText(
            new RegExp(`${pseudo} a été retiré de vos abonnements`, "i")
        );
        await expect(unfollowToast).toBeVisible({ timeout: 10000 });
    });
});
