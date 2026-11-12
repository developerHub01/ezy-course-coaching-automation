import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class LoginLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  readonly signInHeading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Sign In",
      level: 1,
    });

  readonly emailInput = (): Locator =>
    this.page.getByRole("textbox", {
      name: "Email",
    });

  readonly passwordInput = (): Locator =>
    this.page.getByRole("textbox", {
      name: "Password",
    });

  readonly signInButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Sign In",
      exact: true,
    });
}
