import { expect, test as base } from "@playwright/test";

import { GlobalOverlaysComponent } from "@/components/global-overlays/global-overlays.component";
import { OwnerAccountMenuComponent } from "@/components/owner-account-menu/owner-account-menu.component";
import { StudentAccountMenuComponent } from "@/components/student-account-menu/student-account-menu.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { LoginPage } from "@/pages/auth/login/login.page";
import { OwnerDashboardPage } from "@/pages/owner/dashboard/owner-dashboard.page";
import { StudentDashboardPage } from "@/pages/student/dashboard/student-dashboard.page";

interface ProjectFixtures {
  loginPage: LoginPage;
  ownerDashboardPage: OwnerDashboardPage;
  studentDashboardPage: StudentDashboardPage;
  ownerAccountMenu: OwnerAccountMenuComponent;
  studentAccountMenu: StudentAccountMenuComponent;
  toast: ToastComponent;
}

/*
 * Shared test object for the whole project. Every spec and setup file imports { test, expect }
 * from "@/fixtures" so that project-wide overlays are handled on every page automatically.
 */
export const test = base.extend<ProjectFixtures>({
  page: async ({ page }, use) => {
    await new GlobalOverlaysComponent(page).register();
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  ownerDashboardPage: async ({ page }, use) => {
    await use(new OwnerDashboardPage(page));
  },

  studentDashboardPage: async ({ page }, use) => {
    await use(new StudentDashboardPage(page));
  },

  ownerAccountMenu: async ({ page }, use) => {
    await use(new OwnerAccountMenuComponent(page));
  },

  studentAccountMenu: async ({ page }, use) => {
    await use(new StudentAccountMenuComponent(page));
  },

  toast: async ({ page }, use) => {
    await use(new ToastComponent(page));
  },
});

export { expect };
