import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000, // temps max par test
    expect: { timeout: 5_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0, // pas de relance auto des tests (simple)
    workers: 1, // un seul test à la fois (évite les conflits en local)
    reporter: [['list'], ['html', { open: 'never' }]],
    // affichage clair dans la console
    use: {
        baseURL: 'http://localhost:3000',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry', // génère un trace.zip uniquement si le test échoue 2x
        actionTimeout: 10000,
        navigationTimeout: 20000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
