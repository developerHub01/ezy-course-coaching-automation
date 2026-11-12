import type { Page } from "@playwright/test";

import { BasePage } from "@/pages/base/base.page";

import { OwnerDashboardLocators } from "@/pages/owner/dashboard/owner-dashboard.locators";

export class OwnerDashboardPage extends BasePage {
  readonly locators: OwnerDashboardLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new OwnerDashboardLocators(page);
  }

  /*
   * Only navigates. Use it when the visit may end elsewhere, for example a redirect to /login for
   * a logged-out visitor.
   */
  open = async (): Promise<void> => {
    await this.goto("/en/dashboard/");
  };

  /* Returns only once the dashboard has really loaded (URL and welcome heading). */
  waitUntilReady = async (): Promise<void> => {
    await this.page.waitForURL(/\/en\/dashboard\//);
    await this.locators.welcomeHeading().waitFor({
      state: "visible",
    });
  };

  /* Opens the dashboard as a signed-in owner and returns once it is ready to use. */
  openSignedIn = async (): Promise<void> => {
    await this.open();
    await this.waitUntilReady();
  };
}
