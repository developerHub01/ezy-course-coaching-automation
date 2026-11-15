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

  /* The empty-state block. It is visible only while the list has no rows (for example a search with no match). */
  readonly noResults = (): Locator =>
    this.page.getByLabel("no-data-program", {
      exact: true,
    });

  /*
   * The three select boxes of the list, in page order: Category, Session Type and the page size.
   * They have no name of their own, so they are told apart by their position.
   */
  private readonly selectBoxes = (): Locator =>
    this.page
      .getByLabel("coaching-programs-area", {
        exact: true,
      })
      .locator(".ant-select");

  readonly categoryFilter = (): Locator => this.selectBoxes().nth(0);

  readonly sessionTypeFilter = (): Locator => this.selectBoxes().nth(1);

  /* The filter box shows its chosen value in an element titled with that value. */
  readonly chosenFilterValue = (filter: Locator, value: string): Locator =>
    filter.getByTitle(value, {
      exact: true,
    });

  /* Disabled until a filter is set. */
  readonly clearFiltersButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Clear Filters",
    });

  /* Every program row on the page (a row with a Visit button), without the header and empty-state rows. */
  readonly dataRows = (): Locator =>
    this.page.getByRole("row").filter({
      has: this.page.getByRole("button", {
        name: "Visit",
      }),
    });

  /* The program rows that do NOT contain the text (used to prove a filter left nothing else in the list). */
  readonly dataRowsWithout = (text: string): Locator =>
    this.dataRows().filter({
      hasNotText: text,
    });

  /* A program's row, found by its title. The header row never contains a program title. */
  readonly programRow = (title: string): Locator =>
    this.page.getByRole("row").filter({
      hasText: title,
    });

  /* One cell of a program's row, found by its exact text (category, status, limit ...). */
  readonly programCell = (title: string, text: string): Locator =>
    this.programRow(title).getByRole("cell", {
      name: text,
      exact: true,
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
