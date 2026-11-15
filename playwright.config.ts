import { defineConfig, devices } from "@playwright/test";

import { AUTH_PATHS } from "@/helpers/auth-paths";
import { getSiteUrl } from "@/helpers/env";

export default defineConfig({
  testDir: "./src/tests",
  /*
   * EzyCourse can be slow (client-rendered, heavy pages), so timeouts are generous on purpose. With
   * several workers sharing the one demo tenant, a single page load took over 60 seconds, which
   * is why these are higher than the usual defaults.
   */
  timeout: 240_000,
  expect: {
    timeout: 30_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /*
   * Two workers locally. Four browsers loading this slow shared tenant at once made page loads exceed
   * the timeouts, so a test failed for load, not for a defect.
   */
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
      },
    ],
  ],
  use: {
    baseURL: getSiteUrl(),
    actionTimeout: 60_000,
    navigationTimeout: 180_000,
    /*
     * A failed test keeps a full trace (every step, network call and page snapshot), a video and a
     * screenshot. Open them with `pnpm report`.
     */
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    /* Slows every browser action by this many ms so you can follow along. See `pnpm test:slow`. */
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO ?? 0),
      args: ["--start-maximized"],
    },
    /*
     * The browser window opens maximized. This needs both the flag above and `viewport: null`
     * (no fixed page size). Each project that spreads a device preset must repeat `viewport: null`
     * AND clear `deviceScaleFactor`, because the preset sets both and Playwright refuses a null
     * viewport together with a scale factor.
     */
    viewport: null,
    headless: false,
  },
  projects: [
    /*
     * 1. setup: logs in once per role through the UI and saves the sessions.
     *    The owner and student projects wait for it.
     */
    {
      name: "setup",
      testMatch: /setup\/.*\.setup\.ts/,
    },
    /*
     * 2. auth: tests that START LOGGED OUT (login, sign-up). No saved session, no setup needed.
     */
    {
      name: "auth",
      testMatch: /auth\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined,
      },
    },
    /* 3. owner: reuses the saved owner session. */
    {
      name: "owner",
      testMatch: /owner\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined,
        storageState: AUTH_PATHS.owner,
      },
    },
    /* 4. student: reuses the saved student session. */
    {
      name: "student",
      testMatch: /student\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined,
        storageState: AUTH_PATHS.student,
      },
    },
    /*
     * 5. e2e: multi-step journeys. The login and logout journeys sign in themselves, so this project
     *    does not wait for "setup" (that would add logins). Add dependencies: ["setup"] back for
     *    journeys that start from a saved session.
     */
    {
      name: "e2e",
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined,
      },
    },
  ],
});
