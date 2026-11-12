import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class StudentDashboardLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  readonly ongoingCoursesHeading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Ongoing courses",
      exact: true,
    });

  readonly enrolledCoursesHeading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Enrolled courses",
      exact: true,
    });
}
