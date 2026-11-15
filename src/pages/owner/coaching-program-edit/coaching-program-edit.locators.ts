import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

/* The form fields live in CoachingProgramFormLocators. This file only holds what is specific to the page. */
export class CoachingProgramEditLocators extends BaseLocators {
  readonly heading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Edit Coaching Program",
      level: 1,
    });

  readonly backButton = (): Locator =>
    this.page.getByRole("button", {
      name: "arrow-left",
    });
}
