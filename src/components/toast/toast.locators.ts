import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class ToastLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  /* Toasts are rendered inside the "Notifications" region of the page. */
  readonly withText = (text: string): Locator =>
    this.page
      .getByRole("region", {
        name: /Notifications/,
      })
      .getByText(text);
}
