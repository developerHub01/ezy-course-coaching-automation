import type { Locator, Page } from "@playwright/test";

import { SelectDropdownLocators } from "@/components/select-dropdown/select-dropdown.locators";

export class SelectDropdownComponent {
  readonly locators: SelectDropdownLocators;

  constructor(page: Page) {
    this.locators = new SelectDropdownLocators(page);
  }

  /*
   * Opens the dropdown behind `trigger` and picks the item. It returns only once the list has
   * closed AND `chosenValue` (where the select shows its current choice) is on screen.
   */
  choose = async (trigger: Locator, optionText: string, chosenValue: Locator): Promise<void> => {
    await trigger.click();
    await this.pickOption(optionText, chosenValue);
  };

  /*
   * For long lists that only render the first few items (for example the site pages). The text is
   * typed into the select first, so the wanted item is in the list before it is clicked.
   */
  searchAndChoose = async (
    trigger: Locator,
    optionText: string,
    chosenValue: Locator,
  ): Promise<void> => {
    await trigger.click();
    await trigger.fill(optionText);
    await this.pickOption(optionText, chosenValue);
  };

  private pickOption = async (optionText: string, chosenValue: Locator): Promise<void> => {
    await this.locators.option(optionText).click();
    await this.locators.openList().waitFor({
      state: "hidden",
    });
    await chosenValue.waitFor({
      state: "visible",
    });
  };
}
