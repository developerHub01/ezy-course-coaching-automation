import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class OwnerAccountMenuLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  readonly avatar = (): Locator =>
    this.page.getByRole("img", {
      name: "User profile picture",
    });

  /*
   * Matched by role on the dashboard's own menu. Do NOT use getByText("Logout"): the site-builder
   * header also contains hidden "Logout" links that would make the match ambiguous.
   */
  readonly logoutItem = (): Locator =>
    this.page.getByRole("listitem", {
      name: "Logout",
    });
}
