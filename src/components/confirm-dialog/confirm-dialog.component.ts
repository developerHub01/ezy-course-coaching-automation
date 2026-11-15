import type { Locator, Page } from "@playwright/test";

import { ConfirmDialogLocators } from "@/components/confirm-dialog/confirm-dialog.locators";

export class ConfirmDialogComponent {
  readonly locators: ConfirmDialogLocators;

  constructor(page: Page) {
    this.locators = new ConfirmDialogLocators(page);
  }

  /* The dialog itself, so a spec can assert its text. */
  dialog = (): Locator => this.locators.dialog();

  waitUntilOpen = async (): Promise<void> => {
    await this.locators.dialog().waitFor({
      state: "visible",
    });
  };

  /* Clicks one of the dialog's buttons and returns once the dialog has closed. */
  choose = async (buttonName: string): Promise<void> => {
    await this.waitUntilOpen();
    await this.locators.button(buttonName).click();
    await this.locators.dialog().waitFor({
      state: "hidden",
    });
  };
}
