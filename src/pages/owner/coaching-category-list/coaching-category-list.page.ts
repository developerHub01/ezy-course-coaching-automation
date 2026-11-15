import type { Locator, Page } from "@playwright/test";

import { CoachingCategoryDialogComponent } from "@/components/coaching-category-dialog/coaching-category-dialog.component";
import { ConfirmDialogComponent } from "@/components/confirm-dialog/confirm-dialog.component";
import { SelectDropdownComponent } from "@/components/select-dropdown/select-dropdown.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { CoachingCategoryMessage } from "@/helpers/coaching-category-messages";
import type { CreatedCategories } from "@/helpers/created-categories";
import { waitForInputValue } from "@/helpers/wait-for-input-value";
import { BasePage } from "@/pages/base/base.page";
import { CoachingCategoryListLocators } from "@/pages/owner/coaching-category-list/coaching-category-list.locators";

/*
 * Every method returns only after the screen visibly shows its result (the dialog is closed, the
 * toast appeared, the row is shown or gone). The address bar is never used as proof, because the URL
 * can change before the screen has finished updating.
 */
export class CoachingCategoryListPage extends BasePage {
  readonly locators: CoachingCategoryListLocators;
  readonly createDialog: CoachingCategoryDialogComponent;
  readonly updateDialog: CoachingCategoryDialogComponent;
  readonly deleteDialog: ConfirmDialogComponent;
  private readonly toast: ToastComponent;
  private readonly selectDropdown: SelectDropdownComponent;

  constructor(
    page: Page,
    private readonly createdCategories: CreatedCategories,
  ) {
    super(page);
    this.locators = new CoachingCategoryListLocators(page);
    this.createDialog = new CoachingCategoryDialogComponent(
      page,
      "CREATE NEW COACHING CATEGORY",
      "Create",
    );
    this.updateDialog = new CoachingCategoryDialogComponent(
      page,
      "UPDATE COACHING CATEGORY",
      "Update",
    );
    this.deleteDialog = new ConfirmDialogComponent(page);
    this.toast = new ToastComponent(page);
    this.selectDropdown = new SelectDropdownComponent(page);
  }

  /* Opens the list and returns once its categories (not the loading "No Data" row) are on screen. */
  open = async (): Promise<void> => {
    await this.goto("/dashboard/coaching/categories/");
    await this.locators.heading().waitFor({
      state: "visible",
    });
    await this.locators.searchBox().waitFor({
      state: "visible",
    });
    await this.locators.dataRows().first().waitFor({
      state: "visible",
    });
  };

  /* A category's row, so a spec can assert on it. */
  categoryRow = (name: string): Locator => this.locators.categoryRow(name);

  /* Searches by name and returns once the category's row is shown. */
  searchFor = async (name: string): Promise<void> => {
    await this.locators.searchBox().fill(name);
    await this.locators.categoryRow(name).waitFor({
      state: "visible",
    });
  };

  /*
   * Searches for text that should find nothing and returns once the list shows "No Data". After a
   * delete the list shows every category again while the box still holds the old text, and typing the
   * same text does not search again, so open the list again first when searching a deleted name.
   */
  searchExpectingNoResults = async (text: string): Promise<void> => {
    await this.locators.searchBox().fill(text);
    await this.locators.noData().waitFor({
      state: "visible",
    });
  };

  /* Clicks Add Category and returns once the create dialog is open. */
  openCreateDialog = async (): Promise<void> => {
    await this.locators.addCategoryButton().click();
    await this.createDialog.waitUntilOpen();
  };

  /*
   * Creates a category with a name only (it gets the default picture). Returns once the success
   * toast is shown, the dialog is closed and the category's row is in the list.
   */
  createCategory = async (name: string): Promise<void> => {
    await this.openCreateDialog();
    await this.createDialog.fillName(name);
    await this.submitCreate(name);
  };

  /* Same, but also chooses a stock image. */
  createCategoryWithImage = async (name: string): Promise<void> => {
    await this.openCreateDialog();
    await this.createDialog.fillName(name);
    await this.createDialog.chooseImage();
    await this.submitCreate(name);
  };

  /* Clicks Create on a form the app refuses and returns once its message (a toast) is shown. */
  submitCreateExpectingMessage = async (message: string): Promise<void> => {
    await this.createDialog.locators.submitButton().click();
    await this.toast.message(message).waitFor({
      state: "visible",
    });
  };

  /* Opens a category's Edit dialog and returns once it shows the category's saved name. */
  openEditDialog = async (name: string): Promise<void> => {
    await this.searchFor(name);
    await this.locators.actionCell(name).click();
    await this.locators.menuItem("Edit").click();
    await this.updateDialog.waitUntilOpen();
    await waitForInputValue(this.updateDialog.locators.nameInput(), name);
    this.createdCategories.openedName = name;
  };

  /*
   * Clicks Update and returns once the dialog is closed and the category's row shows the name that
   * is now in the field. Saving shows no toast, so the closed dialog and the row are the proof (when only
   * the image changed the row is already on screen, so a test checks the new picture itself). If the
   * name changed, the category is remembered under its new name so it is still deleted.
   */
  saveEdit = async (): Promise<void> => {
    const newName = await this.updateDialog.locators.nameInput().inputValue();
    await this.updateDialog.locators.submitButton().click();
    await this.updateDialog.locators.dialog().waitFor({
      state: "hidden",
    });
    this.createdCategories.rename(this.createdCategories.openedName, newName);
    await this.searchFor(newName);
  };

  /* Clicks Update on an edit the app refuses and returns once its message (a toast) is shown. */
  submitEditExpectingMessage = async (message: string): Promise<void> => {
    await this.updateDialog.locators.submitButton().click();
    await this.toast.message(message).waitFor({
      state: "visible",
    });
  };

  /* The picture of a category's row, as its address. */
  thumbnailSource = async (name: string): Promise<string> =>
    (await this.locators.thumbnail(name).getAttribute("src")) ?? "";

  /* Opens a category's row menu, clicks Delete and returns once the confirmation is on screen. */
  openDeleteConfirmation = async (name: string): Promise<void> => {
    await this.searchFor(name);
    await this.locators.actionCell(name).click();
    await this.locators.menuItem("Delete").click();
    await this.deleteDialog.waitUntilOpen();
  };

  /* Deletes a category and returns once the success toast is shown and its row is gone. */
  deleteCategory = async (name: string): Promise<void> => {
    await this.openDeleteConfirmation(name);
    await this.deleteDialog.choose("Delete");
    await this.toast.message(CoachingCategoryMessage.deleted).waitFor({
      state: "visible",
    });
    await this.locators.categoryRow(name).waitFor({
      state: "hidden",
    });
    this.createdCategories.remove(name);
  };

  /* Starts deleting, answers No, and returns once the dialog is closed and the row is still shown. */
  cancelDeleting = async (name: string): Promise<void> => {
    await this.openDeleteConfirmation(name);
    await this.deleteDialog.choose("No");
    await this.locators.categoryRow(name).waitFor({
      state: "visible",
    });
  };

  /* Chooses how many categories one page lists and returns once the box shows it. */
  setPageSize = async (size: number): Promise<void> => {
    await this.selectDropdown.choose(
      this.locators.pageSizeBox(),
      `${size} / page`,
      this.locators.chosenPageSize(size),
    );
  };

  private submitCreate = async (name: string): Promise<void> => {
    await this.createDialog.locators.submitButton().click();
    /* From here on the category exists even if a later wait fails, so it is remembered for cleanup. */
    this.createdCategories.add(name);
    await this.toast.message(CoachingCategoryMessage.created).waitFor({
      state: "visible",
    });
    await this.createDialog.locators.dialog().waitFor({
      state: "hidden",
    });
    await this.searchFor(name);
  };
}
