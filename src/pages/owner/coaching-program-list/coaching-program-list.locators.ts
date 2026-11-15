import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export class CoachingProgramListLocators extends BaseLocators {
  readonly heading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Coaching Programs",
      level: 3,
    });

  /*
   * The page has two "Add New Program" buttons: this one in the top bar and another inside the hidden
   * empty-state table. Only the top bar button is under the element labelled "top".
   */
  readonly addNewProgramButton = (): Locator =>
    this.page
      .getByLabel("top", {
        exact: true,
      })
      .getByRole("button", {
        name: "Add New Program",
      });

  readonly searchBox = (): Locator =>
    this.page.getByRole("textbox", {
      name: "Search",
    });

  /* The line "Showing results for: <text>" that appears once a search has been applied. */
  readonly searchResultsLabel = (text: string): Locator =>
    this.page.getByText(`Showing results for: ${text}`, {
      exact: true,
    });

  /* A program's row, found by its title. The header row never contains a program title. */
  readonly programRow = (title: string): Locator =>
    this.page.getByRole("row").filter({
      hasText: title,
    });

  /* The three-dot cell at the end of a row. It is a bare icon with this accessible name. */
  readonly actionCell = (title: string): Locator =>
    this.programRow(title).getByRole("cell", {
      name: "action-icon-wrapper",
    });

  readonly visitButton = (title: string): Locator =>
    this.programRow(title).getByRole("button", {
      name: "Visit",
    });

  /* Items of the row menu: Edit, Delete, Add Coach, Pricing, Preview Checkout, Clients. */
  readonly menuItem = (name: string): Locator =>
    this.page.getByRole("menuitem").filter({
      hasText: name,
    });
}
