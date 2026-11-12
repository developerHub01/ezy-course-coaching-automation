import type { Locator, Page } from "@playwright/test";

import { ToastLocators } from "@/components/toast/toast.locators";

/*
 * Short-lived messages (for example the "Invalid credentials" error). They disappear after a few
 * seconds, so assert on them immediately after the action that triggers them.
 */
export class ToastComponent {
  readonly locators: ToastLocators;

  constructor(page: Page) {
    this.locators = new ToastLocators(page);
  }

  message = (text: string): Locator => this.locators.withText(text);
}
