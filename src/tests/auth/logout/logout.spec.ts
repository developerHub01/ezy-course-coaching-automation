import { expect, test } from "@/fixtures";
import { getOwnerCredentials, getStudentCredentials } from "@/helpers/env";
import { Tag } from "@/helpers/tags";

/*
 * Test cases: src/tests/auth/logout/test-cases/logout.md
 * Every test signs in itself in a fresh context, so logging out cannot affect the saved sessions
 * used by the other specs.
 */
test.describe("Logout", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test.describe("Functional", () => {
    /* TC-AUTH-101 */
    test(
      "TC-AUTH-101: Owner signs out from the avatar menu",
      {
        tag: [Tag.Smoke, Tag.Regression, Tag.Owner, Tag.Positive, Tag.Authentication, Tag.Logout],
      },
      async ({ page, loginPage, ownerDashboardPage, ownerAccountMenu }) => {
        await loginPage.login(getOwnerCredentials());
        await ownerDashboardPage.waitUntilReady();

        await ownerAccountMenu.logout();

        await expect(page).toHaveURL(/\/en\/?$/);

        await ownerDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();
      },
    );

    /* TC-AUTH-102 */
    test(
      "TC-AUTH-102: Student signs out from the avatar menu",
      {
        tag: [Tag.Smoke, Tag.Regression, Tag.Student, Tag.Positive, Tag.Authentication, Tag.Logout],
      },
      async ({ page, loginPage, studentDashboardPage, studentAccountMenu }) => {
        await loginPage.login(getStudentCredentials());
        await studentDashboardPage.openSignedIn();

        await studentAccountMenu.logout();

        await expect(page).toHaveURL(/\/en\/?$/);

        await studentDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();
      },
    );
  });

  test.describe("Access Control", () => {
    /* TC-AUTH-103 */
    test(
      "TC-AUTH-103: Back button after logout does not reveal the dashboard",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Authentication, Tag.Logout],
      },
      async ({ page, loginPage, ownerDashboardPage, ownerAccountMenu }) => {
        await loginPage.login(getOwnerCredentials());
        await ownerDashboardPage.waitUntilReady();
        await ownerAccountMenu.logout();

        await page.goBack();

        await expect(page).toHaveURL(/\/login/);
        await expect(ownerDashboardPage.locators.dashboardHeading()).toBeHidden();
      },
    );
  });
});
