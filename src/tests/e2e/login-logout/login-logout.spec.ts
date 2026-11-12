import { expect, test } from "@/fixtures";
import { getOwnerCredentials, getStudentCredentials } from "@/helpers/env";
import { Tag } from "@/helpers/tags";

/* Test cases: src/tests/e2e/login-logout/test-cases/login-logout.md */
test.describe("Login and logout journey", () => {
  test.describe("Functional", () => {
    /* TC-E2E-001 */
    test(
      "TC-E2E-001: Owner signs in, then signs out",
      {
        tag: [
          Tag.E2E,
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Authentication,
          Tag.Login,
          Tag.Logout,
        ],
      },
      async ({ page, loginPage, ownerDashboardPage, ownerAccountMenu }) => {
        await loginPage.open();
        await loginPage.login(getOwnerCredentials());
        await ownerDashboardPage.waitUntilReady();

        await ownerAccountMenu.logout();

        await ownerDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();
      },
    );

    /* TC-E2E-002 */
    test(
      "TC-E2E-002: Student signs in, then signs out",
      {
        tag: [
          Tag.E2E,
          Tag.Regression,
          Tag.Student,
          Tag.Positive,
          Tag.Authentication,
          Tag.Login,
          Tag.Logout,
        ],
      },
      async ({ page, loginPage, studentDashboardPage, studentAccountMenu }) => {
        await loginPage.open();
        await loginPage.login(getStudentCredentials());
        await studentDashboardPage.openSignedIn();

        await studentAccountMenu.logout();

        await studentDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();
      },
    );
  });
});
