import type { Page } from "@playwright/test";

import { CoachingCategoryDialogLocators } from "@/components/coaching-category-dialog/coaching-category-dialog.locators";
import { GalleryComponent } from "@/components/gallery/gallery.component";
import { waitForInputValue } from "@/helpers/wait-for-input-value";

/* Every method returns only after the dialog visibly shows the result of its action. */
export class CoachingCategoryDialogComponent {
  readonly locators: CoachingCategoryDialogLocators;
  private readonly gallery: GalleryComponent;

  constructor(page: Page, title: string, submitLabel: string) {
    this.locators = new CoachingCategoryDialogLocators(page, title, submitLabel);
    this.gallery = new GalleryComponent(page);
  }

  waitUntilOpen = async (): Promise<void> => {
    await this.locators.dialog().waitFor({
      state: "visible",
    });
  };

  fillName = async (name: string): Promise<void> => {
    await this.locators.nameInput().fill(name);
    await waitForInputValue(this.locators.nameInput(), name);
  };

  /*
   * Opens the Gallery from the Upload area and picks the stock image at `position` (the first by
   * default; it needs no file of the tenant and adds nothing to it). Returns once the dialog shows
   * that an image is chosen.
   */
  chooseImage = async (position = 0): Promise<void> => {
    await this.locators.uploadArea().click();
    await this.gallery.selectItemAt("Stock images", position);
    await this.gallery.confirmSelection();
    await this.locators.imageChosenLabel().waitFor({
      state: "visible",
    });
  };

  /* Deletes the image and returns once the Upload area is back. */
  removeImage = async (): Promise<void> => {
    await this.locators.deleteImageIcon().click();
    await this.locators.uploadArea().waitFor({
      state: "visible",
    });
  };

  cancel = async (): Promise<void> => {
    await this.locators.cancelButton().click();
    await this.locators.dialog().waitFor({
      state: "hidden",
    });
  };

  close = async (): Promise<void> => {
    await this.locators.closeButton().click();
    await this.locators.dialog().waitFor({
      state: "hidden",
    });
  };
}
