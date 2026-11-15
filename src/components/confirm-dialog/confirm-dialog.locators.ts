import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

/*
 * The small question dialogs: "Are you sure you want to delete this program?" (No / Yes) and the
 * one-to-one "Booking Not Enabled" warning (Cancel / Continue Anyway). Only one dialog is open at a
 * time, so the dialog role is specific enough.
 */
export class ConfirmDialogLocators extends BaseLocators {
  readonly dialog = (): Locator => this.page.getByRole("dialog");

  readonly button = (name: string): Locator =>
    this.dialog().getByRole("button", {
      name,
      exact: true,
    });
}
