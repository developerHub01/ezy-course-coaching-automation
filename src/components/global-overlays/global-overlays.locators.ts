import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class GlobalOverlaysLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  readonly acceptCookiesButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Accept Cookies",
    });
}
