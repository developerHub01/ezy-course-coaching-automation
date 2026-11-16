import type { Locator } from "@playwright/test";

import { BaseLocators } from "@/pages/base/base.locators";

export type FieldRole = "spinbutton" | "combobox" | "switch";

/*
 * The shared pricing section: the list of price cards and the add / edit form. Every product shows it
 * (course, coaching, community ...), so the locators describe the section and never one product.
 * Cards have no test id, so a card is found through its own id tag ("#322412").
 */
export class PricingLocators extends BaseLocators {
  /* ---------- list ---------- */

  readonly emptyState = (): Locator => this.page.getByText("You don't have any prices yet.");

  readonly countHeading = (count: number): Locator =>
    this.page.getByRole("heading", {
      level: 2,
      name:
        count === 1
          ? "You have 1 price for this product"
          : `You have ${count} prices for this product`,
    });

  /* The button is "Add a price" while the list is empty and "Add more price" afterwards. */
  readonly addPriceButton = (): Locator =>
    this.page
      .getByRole("button", {
        name: /^(Add a price|Add more price)$/,
      })
      .first();

  /* The "#322412" tag of every card, in page order. */
  readonly idTags = (): Locator => this.page.getByText(/^#\d+$/);

  /*
   * The card that holds the id tag AND a menu button. Wider containers hold the tag too, so the
   * innermost one (the last in page order) is the card itself.
   */
  readonly card = (priceId: string): Locator =>
    this.page
      .locator("div")
      .filter({
        has: this.page.getByText(priceId, {
          exact: true,
        }),
      })
      .filter({
        has: this.page.getByRole("button", {
          name: "ellipsis",
        }),
      })
      .last();

  readonly cardMenuButton = (priceId: string): Locator =>
    this.card(priceId).getByRole("button", {
      name: "ellipsis",
    });

  /* Items of the card menu: Edit, Delete, Set as default, Copy Payment URL, Make it private/public, Archive. */
  readonly menuItem = (name: string): Locator =>
    this.page.getByRole("menuitem").filter({
      hasText: name,
    });

  /*
   * The clickable part of a menu item. The item itself (the list entry) is always enabled; a menu
   * action that is not allowed (for example "Set as default" on a private price) is a disabled button
   * inside it, so enabled/disabled is judged on this button.
   */
  readonly menuButton = (name: string): Locator =>
    this.menuItem(name).getByRole("button", {
      name,
    });

  /* A small tag on the card ("Default", "Private", "One Time" ...). */
  readonly cardTag = (priceId: string, text: string): Locator =>
    this.card(priceId).getByText(text, {
      exact: true,
    });

  /* ---------- plan list and form ---------- */

  readonly planOption = (label: string): Locator =>
    this.page
      .getByText(label, {
        exact: true,
      })
      .filter({
        visible: true,
      })
      .first();

  readonly formHeading = (text: string): Locator =>
    this.page
      .getByRole("heading", {
        name: text,
        exact: true,
      })
      .first();

  /* The form that owns a Create or Update button (the page has no other form with those buttons). */
  readonly form = (): Locator =>
    this.page.locator("form").filter({
      has: this.page.getByRole("button", {
        name: /^(Create|Update)$/,
      }),
    });

  readonly createButton = (): Locator =>
    this.form().getByRole("button", {
      name: "Create",
      exact: true,
    });

  readonly updateButton = (): Locator =>
    this.form().getByRole("button", {
      name: "Update",
      exact: true,
    });

  readonly cancelButton = (): Locator =>
    this.form().getByRole("button", {
      name: "Cancel",
      exact: true,
    });

  /* Every message the form shows under its fields (Ant Design renders them as alerts). */
  readonly formAlerts = (): Locator => this.form().getByRole("alert");

  readonly fieldError = (message: string): Locator =>
    this.form().getByText(message, {
      exact: true,
    });

  /*
   * The block of one labelled field: the innermost container that holds the label text and a control
   * of `role`. The number inputs have no accessible name of their own (only a "0.00" placeholder),
   * so they are found through the label printed above them.
   */
  readonly fieldScope = (label: string | RegExp, role: FieldRole): Locator =>
    this.form()
      .locator("div")
      .filter({
        has: this.page.getByText(label, {
          exact: typeof label === "string",
        }),
      })
      .filter({
        has: this.page.getByRole(role),
      })
      .last();

  readonly field = (label: string | RegExp, role: FieldRole): Locator =>
    this.fieldScope(label, role).getByRole(role).first();

  /*
   * What a user clicks to open a labelled select. The hidden input inside it cannot be clicked once a
   * value is chosen (the chosen text covers it, which is the case on every edit form), so the select
   * box itself is the click target.
   */
  readonly selectBox = (label: string): Locator =>
    this.fieldScope(label, "combobox").locator(".ant-select").first();

  /* The value an Ant Design select shows once an option was picked. */
  readonly chosenOption = (label: string, option: string): Locator =>
    this.fieldScope(label, "combobox").getByTitle(option, {
      exact: true,
    });

  /* ---------- expiry ---------- */

  readonly expiryChoice = (choice: "Lifetime" | "Limited"): Locator =>
    this.form().getByText(choice, {
      exact: true,
    });

  readonly expiryRadio = (choice: "Lifetime" | "Limited"): Locator =>
    this.form().getByRole("radio", {
      name: choice,
    });

  /* ---------- checkboxes ---------- */

  readonly advancedInstallmentsCheckbox = (): Locator =>
    this.form().getByRole("checkbox", {
      name: "Use advance installment options",
    });

  readonly dontMultiplyCheckbox = (): Locator =>
    this.form().getByRole("checkbox", {
      name: "Don't multiply price and unit after x quantity",
    });

  /* The text beside a checkbox is what a user clicks. */
  readonly checkboxText = (text: string): Locator => this.form().getByText(text).first();

  /*
   * The number box that appears below "Don't multiply ..." once it is ticked. It is the only number
   * box outside the tier table rows (it has no label), so rows are excluded. Call it before the
   * expiry or trial boxes are opened, which would add more number boxes outside the table.
   */
  readonly dontMultiplyThreshold = (): Locator =>
    this.form().getByRole("spinbutton").and(this.page.locator(":not(tr *)"));

  readonly initialCycleAmount = (): Locator =>
    this.form().getByRole("spinbutton", {
      name: "Enter amount",
    });

  readonly initialCycleLength = (): Locator =>
    this.form().getByRole("spinbutton", {
      name: "Enter count",
    });

  readonly totalInstallments = (): Locator =>
    this.form().getByRole("spinbutton", {
      name: "minimum 2",
    });

  /* ---------- donation amounts ---------- */

  /*
   * The preset, minimum and maximum amount boxes are the first three number boxes of a donation form,
   * in that order. They are addressed by position because finding them through their printed labels
   * is not safe: the minimum and maximum labels share one container, so both labels resolve to the
   * same box. Call these before the expiry days box is opened, which adds a number box after them.
   */
  readonly donationPresetAmount = (): Locator => this.form().getByRole("spinbutton").nth(0);

  readonly donationMinimumAmount = (): Locator => this.form().getByRole("spinbutton").nth(1);

  readonly donationMaximumAmount = (): Locator => this.form().getByRole("spinbutton").nth(2);

  /* ---------- tier tables ---------- */

  readonly tierRows = (): Locator => this.form().locator("tbody tr");

  /* Inside the form the table header cells are plain cells (First Unit, Last Unit, Per Unit / Unit, Price). */
  readonly tierHeaderCell = (name: string): Locator =>
    this.form().getByRole("cell", {
      name,
      exact: true,
    });

  readonly addTierButton = (): Locator =>
    this.form().getByRole("button", {
      name: /Add another tier/,
    });

  /* ---------- donation text ---------- */

  readonly donationTextEditor = (): Locator =>
    this.form()
      .getByRole("textbox")
      .filter({
        has: this.page.getByRole("paragraph"),
      });
}
