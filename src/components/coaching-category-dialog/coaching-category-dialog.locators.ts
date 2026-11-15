import type { Locator, Page } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

/*
 * The dialog for one coaching category. "Add Category" opens it titled "CREATE NEW COACHING
 * CATEGORY" (button Create) and a row's Edit opens it titled "UPDATE COACHING CATEGORY" (button
 * Update). The fields are the same, so one set of locators serves both, told apart by the title.
 */
export class CoachingCategoryDialogLocators extends BaseLocators {
  constructor(
    page: Page,
    private readonly title: string,
    private readonly submitLabel: string,
  ) {
    super(page);
  }

  readonly dialog = (): Locator =>
    this.page.getByRole("dialog", {
      name: this.title,
    });

  /* The only textbox of the dialog. The update dialog gives it no name, so it is found by being the only one. */
  readonly nameInput = (): Locator => this.dialog().getByRole("textbox");

  /* Shown while the category has no image. Clicking it opens the Gallery. */
  readonly uploadArea = (): Locator =>
    this.dialog().getByText("Upload", {
      exact: true,
    });

  /* Shown while the category has an image. */
  readonly imageChosenLabel = (): Locator =>
    this.dialog().getByText("Preview", {
      exact: true,
    });

  readonly deleteImageIcon = (): Locator =>
    this.dialog().getByRole("img", {
      name: "delete",
    });

  readonly submitButton = (): Locator =>
    this.dialog().getByRole("button", {
      name: this.submitLabel,
      exact: true,
    });

  readonly cancelButton = (): Locator =>
    this.dialog().getByRole("button", {
      name: "Cancel",
      exact: true,
    });

  readonly closeButton = (): Locator =>
    this.dialog().getByRole("button", {
      name: "Close",
      exact: true,
    });
}
