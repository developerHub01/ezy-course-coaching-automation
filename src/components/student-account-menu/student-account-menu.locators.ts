import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class StudentAccountMenuLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  /*
   * The student dashboard shows two "User profile picture" images: the header avatar (first in the
   * page order) and the large profile card below it. The header avatar opens the menu.
   */
  readonly avatar = (): Locator =>
    this.page
      .getByRole("img", {
        name: "User profile picture",
      })
      .first();

  readonly logoutItem = (): Locator =>
    this.page.getByRole("listitem").filter({
      hasText: /^Logout$/,
    });
}
