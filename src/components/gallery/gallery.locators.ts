import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export type GalleryTab =
  | "Image"
  | "Stock images"
  | "Video"
  | "File/Doc"
  | "Audio"
  | "YouTube"
  | "Vimeo"
  | "Iframe Video"
  | "SCORM/HTML";

/*
 * The Gallery: EzyCourse's media library, shared by the whole dashboard (see docs/product/gallery.md).
 * The "Gallery" button in the top bar opens all of it. Fields that need a file (for example the
 * feature image of a coaching program) open the same dialog, limited to the tabs they accept and to
 * ONE chosen item. The top bar Gallery allows several chosen items at once.
 *
 * The tabs and the item cards are plain elements without roles, so they are found by the
 * Gallery's own CSS classes. "_active" marks the open tab and "_mdl_glry_crd_active" a chosen card.
 */
export class GalleryLocators extends BaseLocators {
  readonly dialog = (): Locator =>
    this.page.getByRole("dialog", {
      name: "Upload From Gallery",
    });

  /* The "Gallery" button in the top bar of the dashboard. */
  readonly headerButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Gallery",
      exact: true,
    });

  readonly closeButton = (): Locator =>
    this.dialog().getByRole("button", {
      name: "Close",
    });

  /* A tab is a list item that holds a paragraph with the tab's name. */
  readonly tab = (tab: GalleryTab): Locator =>
    this.dialog()
      .locator("li")
      .filter({
        has: this.page.getByText(tab, {
          exact: true,
        }),
      });

  readonly activeTab = (tab: GalleryTab): Locator =>
    this.tab(tab).and(this.page.locator("._active"));

  /* The items of the open tab (10 per page). */
  readonly cards = (): Locator => this.dialog().locator("._mdl_glry_crd");

  readonly chosenCards = (): Locator => this.dialog().locator("._mdl_glry_crd_active");

  /* Confirms the choice. It only works once an item is chosen. Only the field pickers have it. */
  readonly selectButton = (): Locator =>
    this.dialog().getByRole("button", {
      name: "Select",
      exact: true,
    });
}
