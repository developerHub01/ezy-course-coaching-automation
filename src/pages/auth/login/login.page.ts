import type { Page } from "@playwright/test";

import type { Credentials } from "@/helpers/env";
import { LoginLocators } from "@/pages/auth/login/login.locators";
import { BasePage } from "@/pages/base/base.page";

export class LoginPage extends BasePage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  /* The form is rendered client-side, so wait until it exists before interacting. */
  open = async (): Promise<void> => {
    await this.goto("/login");
    await this.locators.emailInput().waitFor({
      state: "visible",
    });
  };

  clickSignIn = async (): Promise<void> => {
    await this.locators.signInButton().click();
  };

  /* Fills the form and clicks Sign In without waiting. Use it for logins that should fail. */
  submit = async (credentials: Credentials): Promise<void> => {
    await this.locators.emailInput().fill(credentials.email);
    await this.locators.passwordInput().fill(credentials.password);
    await this.clickSignIn();
  };

  /* Signs in and returns only once the browser has left the login page. */
  login = async (credentials: Credentials): Promise<void> => {
    await this.submit(credentials);
    await this.page.waitForURL((url) => !url.pathname.startsWith("/login"));
  };

  /* The browser's own message for an empty required Email field (no request is sent). */
  getEmailValidationMessage = (): Promise<string> =>
    this.locators
      .emailInput()
      .evaluate((element) => (element as HTMLInputElement).validationMessage);
}
