import type { Page } from "@playwright/test";

import { BasePage } from "@/pages/base/base.page";

import { StudentDashboardLocators } from "@/pages/student/dashboard/student-dashboard.locators";

export class StudentDashboardPage extends BasePage {
  readonly locators: StudentDashboardLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new StudentDashboardLocators(page);
  }

  /*
   * Only navigates. Use it when the visit may end elsewhere, for example a redirect to /login for
   * a logged-out visitor.
   */
  open = async (): Promise<void> => {
    await this.goto("/en/student/dashboard/");
  };

  /* Returns only once the dashboard has really loaded (URL and the Ongoing courses heading). */
  waitUntilReady = async (): Promise<void> => {
    await this.page.waitForURL(/\/en\/student\/dashboard\//);
    await this.locators.ongoingCoursesHeading().waitFor({
      state: "visible",
    });
  };

  /* Opens the dashboard as a signed-in student and returns once it is ready to use. */
  openSignedIn = async (): Promise<void> => {
    await this.open();
    await this.waitUntilReady();
  };
}
