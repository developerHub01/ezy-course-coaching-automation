import { defineConfig, devices } from "@playwright/test";

import { AUTH_PATHS } from "./src/helpers/auth-paths";
import { getSiteUrl } from "./src/helpers/env";

export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: getSiteUrl(),
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // 1. Logs in once per role and saves the sessions. Other projects wait for it.
    {
      name: "setup",
      testMatch: /setup\/.*\.setup\.ts/,
    },
    // 2. Owner tests reuse the owner session.
    {
      name: "owner",
      testMatch: /owner\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: AUTH_PATHS.owner },
    },
    // 3. Student tests reuse the student session.
    {
      name: "student",
      testMatch: /student\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: AUTH_PATHS.student },
    },
    // 4. E2E journeys use both roles, so they open their own contexts (see fixtures).
    {
      name: "e2e",
      testMatch: /e2e\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
