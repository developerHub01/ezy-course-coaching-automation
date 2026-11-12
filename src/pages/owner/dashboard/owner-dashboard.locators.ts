import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class OwnerDashboardLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  /* The title is shown while the page is still a loading skeleton, so it is not a "ready" signal. */
  readonly dashboardHeading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Dashboard",
      level: 1,
      exact: true,
    });

  /* Appears only once the dashboard has loaded, so it proves the owner is signed in and ready. */
  readonly welcomeHeading = (): Locator =>
    this.page.getByRole("heading", {
      name: /^Welcome back/,
    });
}
