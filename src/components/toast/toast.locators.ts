import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class ToastLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  /*
   * Two toast styles exist. The login pages render them inside the "Notifications" region. The
   * owner dashboard (for example "Coaching Program Created Successfully") renders them as an alert.
   * The same message can be on screen twice when an action is repeated within a few seconds (two
   * deletes in a row), so the first match is used instead of failing on two elements.
   */
  readonly withText = (text: string): Locator =>
    this.page
      .getByRole("region", {
        name: "Notifications",
      })
      .getByText(text)
      .or(this.page.getByRole("alert").getByText(text))
      .first();
}
