import type { Page } from "@playwright/test";

import { GalleryLocators } from "@/components/gallery/gallery.locators";
import type { GalleryTab } from "@/components/gallery/gallery.locators";

export class GalleryComponent {
  readonly locators: GalleryLocators;

  constructor(page: Page) {
    this.locators = new GalleryLocators(page);
  }

  /* Opens the whole Gallery from the top bar and returns once the dialog is on screen. */
  openFromHeader = async (): Promise<void> => {
    await this.locators.headerButton().click();
    await this.locators.dialog().waitFor({
      state: "visible",
    });
  };

  close = async (): Promise<void> => {
    await this.locators.closeButton().click();
    await this.locators.dialog().waitFor({
      state: "hidden",
    });
  };

  /* Opens a tab and returns once it is the active tab. */
  showTab = async (tab: GalleryTab): Promise<void> => {
    await this.locators.tab(tab).click();
    await this.locators.activeTab(tab).waitFor();
  };

  /*
   * Chooses the first `count` items of a tab (default 1) and returns once the last of them is marked
   * as chosen. Several items work only in the top bar Gallery; a field picker keeps a single choice.
   * A field picker still needs confirmSelection() afterwards.
   */
  selectItems = async (tab: GalleryTab, count = 1): Promise<void> => {
    await this.showTab(tab);
    for (let index = 0; index < count; index++) await this.locators.cards().nth(index).click();
    await this.locators
      .chosenCards()
      .nth(count - 1)
      .waitFor();
  };

  /* Chooses the item at a position of a tab (the first item is position 0). */
  selectItemAt = async (tab: GalleryTab, position: number): Promise<void> => {
    await this.showTab(tab);
    await this.locators.cards().nth(position).click();
    await this.locators.chosenCards().first().waitFor();
  };

  /* Clicks Select in a field picker and returns once the dialog has closed (the choice was accepted). */
  confirmSelection = async (): Promise<void> => {
    await this.locators.selectButton().click();
    await this.locators.dialog().waitFor({
      state: "hidden",
    });
  };
}
