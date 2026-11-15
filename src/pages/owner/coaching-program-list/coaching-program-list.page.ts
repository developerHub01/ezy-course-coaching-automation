import type { Locator, Page } from "@playwright/test";

import { ConfirmDialogComponent } from "@/components/confirm-dialog/confirm-dialog.component";
import { SelectDropdownComponent } from "@/components/select-dropdown/select-dropdown.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { CoachingProgramMessage } from "@/helpers/coaching-program-messages";
import type { CreatedPrograms } from "@/helpers/created-programs";
import { BasePage } from "@/pages/base/base.page";
import { CoachingProgramCreatePage } from "@/pages/owner/coaching-program-create/coaching-program-create.page";
import { CoachingProgramEditPage } from "@/pages/owner/coaching-program-edit/coaching-program-edit.page";
import { CoachingProgramListLocators } from "@/pages/owner/coaching-program-list/coaching-program-list.locators";

/*
 * Every method returns only after the screen visibly shows its result (the next form is loaded, the
 * results are filtered, the toast appeared and the row is gone). The address bar is never used as
 * proof, because the URL can change before the screen has finished updating.
 */
export class CoachingProgramListPage extends BasePage {
  readonly locators: CoachingProgramListLocators;
  readonly deleteDialog: ConfirmDialogComponent;
  private readonly selectDropdown: SelectDropdownComponent;
  private readonly toast: ToastComponent;
  private readonly createPage: CoachingProgramCreatePage;
  private readonly editPage: CoachingProgramEditPage;

  constructor(
    page: Page,
    private readonly createdPrograms: CreatedPrograms,
  ) {
    super(page);
    this.locators = new CoachingProgramListLocators(page);
    this.deleteDialog = new ConfirmDialogComponent(page);
    this.selectDropdown = new SelectDropdownComponent(page);
    this.toast = new ToastComponent(page);
    this.createPage = new CoachingProgramCreatePage(page, createdPrograms);
    this.editPage = new CoachingProgramEditPage(page, createdPrograms);
  }

  /*
   * Opens the list and returns once it is on screen. No language prefix is written here: the app
   * redirects to the owner's own language.
   */
  open = async (): Promise<void> => {
    await this.goto("/dashboard/coaching/coaching-programs/");
    await this.locators.heading().waitFor({
      state: "visible",
    });
    await this.locators.searchBox().waitFor({
      state: "visible",
    });
  };

  /* A program's row, so a spec can assert on its text (title, type badge, status, limit). */
  programRow = (title: string): Locator => this.locators.programRow(title);

  /*
   * Searches by title and returns once the list shows "Showing results for: <title>" and the
   * program's row. The tenant holds over a thousand programs, so every action on one starts here.
   */
  searchFor = async (title: string): Promise<void> => {
    await this.locators.searchBox().fill(title);
    await this.locators.searchResultsLabel(title).waitFor({
      state: "visible",
    });
    await this.locators.programRow(title).waitFor({
      state: "visible",
    });
  };

  /* Searches for text that should find nothing and returns once the list shows "Showing results for: <text>". */
  searchExpectingNoResults = async (text: string): Promise<void> => {
    await this.locators.searchBox().fill(text);
    await this.locators.searchResultsLabel(text).waitFor({
      state: "visible",
    });
  };

  /* Chooses a category in the Category filter and returns once the filter shows it. */
  filterByCategory = async (category: string): Promise<void> => {
    const filter = this.locators.categoryFilter();
    await this.selectDropdown.choose(
      filter,
      category,
      this.locators.chosenFilterValue(filter, category),
    );
  };

  filterBySessionType = async (sessionType: string): Promise<void> => {
    const filter = this.locators.sessionTypeFilter();
    await this.selectDropdown.choose(
      filter,
      sessionType,
      this.locators.chosenFilterValue(filter, sessionType),
    );
  };

  /* Clicks Clear Filters and returns once the button is disabled again (no filter is set). */
  clearFilters = async (): Promise<void> => {
    await this.locators.clearFiltersButton().click();
    await this.locators.clearFiltersButton().and(this.page.locator(":disabled")).waitFor();
  };

  /* Clicks Add New Program and returns once the create form is on screen. */
  openCreateForm = async (): Promise<void> => {
    await this.locators.addNewProgramButton().click();
    await this.createPage.waitUntilReady();
  };

  /* Opens the three-dot menu of a program and returns once the menu is on screen. */
  openActionMenu = async (title: string): Promise<void> => {
    await this.searchFor(title);
    await this.locators.actionCell(title).click();
    await this.locators.menuItem("Edit").waitFor({
      state: "visible",
    });
  };

  /* Opens the program's edit form and returns once the form shows the program's saved title. */
  openEditForm = async (title: string): Promise<void> => {
    await this.openActionMenu(title);
    await this.locators.menuItem("Edit").click();
    await this.editPage.waitUntilLoaded(title);
  };

  /* Deletes a program and returns once the success toast is shown and its row is gone. */
  deleteProgram = async (title: string): Promise<void> => {
    await this.openActionMenu(title);
    await this.locators.menuItem("Delete").click();
    await this.deleteDialog.choose("Yes");
    await this.toast.message(CoachingProgramMessage.deleted).waitFor({
      state: "visible",
    });
    await this.locators.programRow(title).waitFor({
      state: "hidden",
    });
    this.createdPrograms.remove(title);
  };

  /* Starts deleting a program, answers No, and returns once the dialog is closed and the row is still shown. */
  cancelDeleting = async (title: string): Promise<void> => {
    await this.openActionMenu(title);
    await this.locators.menuItem("Delete").click();
    await this.deleteDialog.choose("No");
    await this.locators.programRow(title).waitFor({
      state: "visible",
    });
  };
}
