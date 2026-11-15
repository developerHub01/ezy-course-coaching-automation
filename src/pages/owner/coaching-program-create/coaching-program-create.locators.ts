import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

/* The form fields live in CoachingProgramFormLocators. This file only holds what is specific to the page. */
export class CoachingProgramCreateLocators extends BaseLocators {
  readonly heading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Create A Coaching Program",
      level: 1,
    });
}
