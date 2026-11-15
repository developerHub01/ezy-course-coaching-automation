import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

/*
 * Ant Design dropdowns (Category, Appointment, list filters). The items you can really click live in
 * a floating list. The role="option" nodes are hidden accessibility copies and cannot be clicked, so
 * the visible items are found by their title inside the list that is currently open.
 */
export class SelectDropdownLocators extends BaseLocators {
  readonly openList = (): Locator =>
    this.page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden)");

  readonly option = (text: string): Locator =>
    this.openList().getByTitle(text, {
      exact: true,
    });
}
