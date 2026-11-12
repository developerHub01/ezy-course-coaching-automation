import { defineConfig, devices } from "@playwright/test";

import { AUTH_PATHS } from "@/helpers/auth-paths";
import { getSiteUrl } from "@/helpers/env";

export default defineConfig({
  testDir: "./src/tests",
  /* EzyCourse can be slow (client-rendered, heavy pages), so timeouts are generous on purpose. */
  timeout: 90_000,
  expect: {
    timeout: 20_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
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
    },
    headless: false,
  },
  projects: [
    /*
     * 1. setup: logs in once per role through the UI and saves the sessions.
     *    The owner, student and e2e projects wait for it.
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
      },
    },
    /* 3. owner: reuses the saved owner session. */
    {
      name: "owner",
      testMatch: /owner\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: AUTH_PATHS.owner,
      },
    },
    /* 4. student: reuses the saved student session. */
    {
      name: "student",
      testMatch: /student\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
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
      },
    },
  ],
});
