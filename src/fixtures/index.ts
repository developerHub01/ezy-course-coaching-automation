import { expect, test as base } from "@playwright/test";

import { GlobalOverlaysComponent } from "@/components/global-overlays/global-overlays.component";
import { OwnerAccountMenuComponent } from "@/components/owner-account-menu/owner-account-menu.component";
import { StudentAccountMenuComponent } from "@/components/student-account-menu/student-account-menu.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { LoginPage } from "@/pages/auth/login/login.page";
import { CoachingProgramCreatePage } from "@/pages/owner/coaching-program-create/coaching-program-create.page";
import { CoachingProgramEditPage } from "@/pages/owner/coaching-program-edit/coaching-program-edit.page";
import { CoachingProgramListPage } from "@/pages/owner/coaching-program-list/coaching-program-list.page";
import { OwnerDashboardPage } from "@/pages/owner/dashboard/owner-dashboard.page";
import { StudentDashboardPage } from "@/pages/student/dashboard/student-dashboard.page";

interface ProjectFixtures {
  loginPage: LoginPage;
  coachingProgramListPage: CoachingProgramListPage;
  coachingProgramCreatePage: CoachingProgramCreatePage;
  coachingProgramEditPage: CoachingProgramEditPage;
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

  coachingProgramListPage: async ({ page }, use) => {
    await use(new CoachingProgramListPage(page));
  },

  /*
   * Deletes every program the test created, after the test, whether it passed or failed. Creating
   * data on the shared tenant without removing it would leave junk behind for everyone.
   */
  coachingProgramCreatePage: async ({ page }, use) => {
    const createPage = new CoachingProgramCreatePage(page);
    await use(createPage);
    const listPage = new CoachingProgramListPage(page);
    for (const title of createPage.submittedTitles) {
      await listPage.open();
      await listPage.deleteProgram(title);
    }
  },

  coachingProgramEditPage: async ({ page }, use) => {
    await use(new CoachingProgramEditPage(page));
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
