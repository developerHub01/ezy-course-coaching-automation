import { existsSync } from "node:fs";

import type { Browser } from "@playwright/test";

import { expect, test as setup } from "@/fixtures";
import { AUTH_PATHS } from "@/helpers/auth-paths";
import { getOwnerCredentials, getSiteUrl, getStudentCredentials } from "@/helpers/env";
import { LoginPage } from "@/pages/auth/login/login.page";
import { OwnerDashboardPage } from "@/pages/owner/dashboard/owner-dashboard.page";
import { StudentDashboardPage } from "@/pages/student/dashboard/student-dashboard.page";

/*
 * A saved session is reused for as long as the app still accepts it, so most runs never open the
 * login page (every login is a real request, and the login API has already rate-limited us). The
 * session counts as working only when the role's own dashboard really loads with it.
 */
const ownerSessionWorks = async (browser: Browser): Promise<boolean> => {
  if (!existsSync(AUTH_PATHS.owner)) return false;
  const context = await browser.newContext({
    baseURL: getSiteUrl(),
    storageState: AUTH_PATHS.owner,
    viewport: null,
  });
  try {
    const dashboard = new OwnerDashboardPage(await context.newPage());
    await dashboard.open();
    return await dashboard.locators
      .welcomeHeading()
      .waitFor({
        timeout: 30_000,
      })
      .then(
        () => true,
        () => false,
      );
  } finally {
    await context.close();
  }
};

const studentSessionWorks = async (browser: Browser): Promise<boolean> => {
  if (!existsSync(AUTH_PATHS.student)) return false;
  const context = await browser.newContext({
    baseURL: getSiteUrl(),
    storageState: AUTH_PATHS.student,
    viewport: null,
  });
  try {
    const dashboard = new StudentDashboardPage(await context.newPage());
    await dashboard.open();
    return await dashboard.locators
      .ongoingCoursesHeading()
      .waitFor({
        timeout: 30_000,
      })
      .then(
        () => true,
        () => false,
      );
  } finally {
    await context.close();
  }
};

/*
 * Logs in through the UI only when there is no working saved session, and saves the session for
 * the other projects. The cookie banner is handled globally by the shared fixture, not here.
 */
setup("authenticate as owner", async ({ browser, page }) => {
  if (await ownerSessionWorks(browser)) return;
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(getOwnerCredentials());
  await expect(page).toHaveURL(/\/dashboard\//);
  await page.context().storageState({
    path: AUTH_PATHS.owner,
  });
});

setup("authenticate as student", async ({ browser, page }) => {
  if (await studentSessionWorks(browser)) return;
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(getStudentCredentials());
  await expect(page).not.toHaveURL(/\/login/);
  await page.context().storageState({
    path: AUTH_PATHS.student,
  });
});
