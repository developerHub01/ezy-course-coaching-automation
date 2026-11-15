import { expect, test as setup } from "@/fixtures";
import { AUTH_PATHS } from "@/helpers/auth-paths";
import { getOwnerCredentials, getStudentCredentials } from "@/helpers/env";
import { LoginPage } from "@/pages/auth/login/login.page";

/*
 * Logs in through the UI once per role and saves each session for the other projects.
 * The cookie banner is handled globally by the shared fixture, not here.
 */
setup("authenticate as owner", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(getOwnerCredentials());
  await expect(page).toHaveURL(/\/dashboard\//);
  await page.context().storageState({
    path: AUTH_PATHS.owner,
  });
});

setup("authenticate as student", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(getStudentCredentials());
  await expect(page).not.toHaveURL(/\/login/);
  await page.context().storageState({
    path: AUTH_PATHS.student,
  });
});
