import { expect, test as base } from "@playwright/test";

import { GlobalOverlaysComponent } from "@/components/global-overlays/global-overlays.component";
import { OwnerAccountMenuComponent } from "@/components/owner-account-menu/owner-account-menu.component";
import { StudentAccountMenuComponent } from "@/components/student-account-menu/student-account-menu.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { CreatedPrograms } from "@/helpers/created-programs";
import { buildCoachingProgram } from "@/helpers/data/coaching-program.factory";
import type { CoachingProgramData } from "@/helpers/data/coaching-program.factory";
import { LoginPage } from "@/pages/auth/login/login.page";
import { CoachingProgramCreatePage } from "@/pages/owner/coaching-program-create/coaching-program-create.page";
import { CoachingProgramEditPage } from "@/pages/owner/coaching-program-edit/coaching-program-edit.page";
import { CoachingProgramListPage } from "@/pages/owner/coaching-program-list/coaching-program-list.page";
import { OwnerDashboardPage } from "@/pages/owner/dashboard/owner-dashboard.page";
import { StudentDashboardPage } from "@/pages/student/dashboard/student-dashboard.page";

interface ProjectFixtures {
  loginPage: LoginPage;
  createdPrograms: CreatedPrograms;
  createProgram: (overrides?: Partial<CoachingProgramData>) => Promise<CoachingProgramData>;
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

  /*
   * Remembers the programs a test created and deletes whatever is left of them after the test,
   * whether it passed or failed. Creating data on the shared tenant without removing it would leave
   * junk behind for everyone. The page objects keep the list up to date (a program the test deletes
   * or renames is not deleted twice).
   */
  createdPrograms: async ({ page }, use) => {
    const createdPrograms = new CreatedPrograms();
    await use(createdPrograms);
    const listPage = new CoachingProgramListPage(page, createdPrograms);
    for (const title of [...createdPrograms.titles]) {
      await listPage.open();
      await listPage.deleteProgram(title);
    }
  },

  coachingProgramListPage: async ({ page, createdPrograms }, use) => {
    await use(new CoachingProgramListPage(page, createdPrograms));
  },

  coachingProgramCreatePage: async ({ page, createdPrograms }, use) => {
    await use(new CoachingProgramCreatePage(page, createdPrograms));
  },

  coachingProgramEditPage: async ({ page, createdPrograms }, use) => {
    await use(new CoachingProgramEditPage(page, createdPrograms));
  },

  /*
   * Makes a program that the test needs as its starting point (the test is about changing, finding or
   * deleting it, not about creating it) and returns the data it was made from.
   */
  createProgram: async ({ coachingProgramListPage, coachingProgramCreatePage }, use) => {
    await use(async (overrides = {}) => {
      const data = buildCoachingProgram(overrides);
      await coachingProgramListPage.open();
      await coachingProgramListPage.openCreateForm();
      await coachingProgramCreatePage.create(data);
      return data;
    });
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
