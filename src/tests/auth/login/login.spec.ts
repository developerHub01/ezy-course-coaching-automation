import { expect, test } from "@/fixtures";
import { buildCredentials } from "@/helpers/data/credentials.factory";
import { getOwnerCredentials, getStudentCredentials } from "@/helpers/env";
import { Tag } from "@/helpers/tags";

/* Test cases: src/tests/auth/login/test-cases/login.md */
test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test.describe("Functional", () => {
    /* TC-AUTH-001 */
    test(
      "TC-AUTH-001: Owner signs in with valid credentials",
      {
        tag: [
          Tag.Smoke,
          Tag.Sanity,
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Authentication,
          Tag.Login,
        ],
      },
      async ({ page, loginPage, ownerDashboardPage }) => {
        await loginPage.login(getOwnerCredentials());

        await expect(page).toHaveURL(/\/en\/dashboard\//);
        await expect(ownerDashboardPage.locators.dashboardHeading()).toBeVisible();
        await expect(ownerDashboardPage.locators.welcomeHeading()).toBeVisible();
      },
    );

    /* TC-AUTH-002 */
    test(
      "TC-AUTH-002: Student signs in with valid credentials",
      {
        tag: [Tag.Smoke, Tag.Regression, Tag.Student, Tag.Positive, Tag.Authentication, Tag.Login],
      },
      async ({ page, loginPage, studentDashboardPage }) => {
        await loginPage.login(getStudentCredentials());
        await studentDashboardPage.open();

        await expect(page).toHaveURL(/\/en\/student\/dashboard\//);
        await expect(studentDashboardPage.locators.ongoingCoursesHeading()).toBeVisible();
        await expect(studentDashboardPage.locators.enrolledCoursesHeading()).toBeVisible();
      },
    );

    /* TC-AUTH-003 */
    test(
      "TC-AUTH-003: Unregistered email is rejected",
      {
        tag: [Tag.Regression, Tag.Guest, Tag.Negative, Tag.Authentication, Tag.Login],
      },
      async ({ page, loginPage, toast, ownerDashboardPage }) => {
        await loginPage.submit(buildCredentials());

        await expect(toast.message("Invalid credentials")).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();

        await ownerDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
      },
    );

    /* TC-AUTH-005 */
    test(
      "TC-AUTH-005: Signed-in owner stays signed in after a page reload",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Authentication, Tag.Login],
      },
      async ({ page, loginPage, ownerDashboardPage }) => {
        await loginPage.login(getOwnerCredentials());
        await ownerDashboardPage.waitUntilReady();

        await page.reload();

        await expect(page).toHaveURL(/\/en\/dashboard\//);
        await expect(ownerDashboardPage.locators.welcomeHeading()).toBeVisible();
      },
    );
  });

  test.describe("Validation", () => {
    /* TC-AUTH-004 */
    test(
      "TC-AUTH-004: Empty email and password are not submitted",
      {
        tag: [Tag.Regression, Tag.Guest, Tag.Negative, Tag.Authentication, Tag.Login],
      },
      async ({ page, loginPage }) => {
        await loginPage.clickSignIn();

        expect(await loginPage.getEmailValidationMessage()).toBe("Please fill out this field.");
        await expect(page).toHaveURL(/\/login/);
      },
    );
  });

  test.describe("Access Control", () => {
    /* TC-AUTH-006 */
    test(
      "TC-AUTH-006: Logged-out visitor cannot open the dashboards",
      {
        tag: [Tag.Sanity, Tag.Regression, Tag.Guest, Tag.Negative, Tag.Authentication, Tag.Login],
      },
      async ({ page, loginPage, ownerDashboardPage, studentDashboardPage }) => {
        await ownerDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();
        await expect(ownerDashboardPage.locators.dashboardHeading()).toBeHidden();

        await studentDashboardPage.open();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.locators.signInHeading()).toBeVisible();
        await expect(studentDashboardPage.locators.ongoingCoursesHeading()).toBeHidden();
      },
    );
  });
});
