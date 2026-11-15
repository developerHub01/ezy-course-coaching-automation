import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

/* How many characters of a category's name the list shows. */
const MAX_NAME_LENGTH_SHOWN_IN_LIST = 20;

export class CoachingCategoryListLocators extends BaseLocators {
  readonly heading = (): Locator =>
    this.page.getByRole("heading", {
      name: "Coaching Categories",
      level: 1,
    });

  readonly addCategoryButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Add Category",
    });

  readonly searchBox = (): Locator =>
    this.page.getByRole("textbox", {
      name: "Search By Category Name",
    });

  /* The "No Data" row of an empty list (for example a search with no match). */
  readonly noData = (): Locator =>
    this.page.getByRole("cell", {
      name: "No Data",
    });

  /* Every category row on the page (a row that shows a thumbnail), without the header and "No Data" rows. */
  readonly dataRows = (): Locator =>
    this.page.getByRole("row").filter({
      has: this.page.getByRole("img", {
        name: "Coaching category avatar",
      }),
    });

  /*
   * A category's row, found by its name. The list shows at most the first 20 characters of a name,
   * followed by "..." once the name is longer than 10 characters, so a row is found by the first 20
   * characters. A name must therefore be different within its first 20 characters to be found.
   */
  readonly categoryRow = (name: string): Locator =>
    this.page.getByRole("row").filter({
      hasText: name.slice(0, MAX_NAME_LENGTH_SHOWN_IN_LIST),
    });

  readonly thumbnail = (name: string): Locator =>
    this.categoryRow(name).getByRole("img", {
      name: "Coaching category avatar",
    });

  /* The three-dot cell at the end of a row. It has no name, so it is the row's last cell. */
  readonly actionCell = (name: string): Locator => this.categoryRow(name).getByRole("cell").last();

  /* Items of the row menu: Edit and Delete. */
  readonly menuItem = (label: string): Locator =>
    this.page.getByRole("menuitem").filter({
      hasText: label,
    });

  readonly pageSizeBox = (): Locator => this.page.locator(".ant-pagination-options .ant-select");

  /* The box shows the chosen size twice (the value and its list entry), so the first one is used. */
  readonly chosenPageSize = (size: number): Locator =>
    this.pageSizeBox()
      .getByTitle(`${size} / page`, {
        exact: true,
      })
      .first();
}
