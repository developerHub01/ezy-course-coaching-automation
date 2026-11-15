import { expect, test } from "@/fixtures";
import { CoachingCategoryMessage } from "@/helpers/coaching-category-messages";
import {
  buildCoachingCategory,
  buildCoachingCategoryNameOfLength,
} from "@/helpers/data/coaching-category.factory";
import { Tag } from "@/helpers/tags";

/*
 * Test cases: src/tests/owner/coaching-category/test-cases/coaching-category.md
 * A test that needs a category as its starting point makes it with the createCategory fixture. The
 * fixture deletes every category left over when the test ends, even after a failure, and does not
 * try again for one the test already deleted or renamed. Saving an edit shows no message, so an edit
 * is judged by the dialog closing and the row showing the result.
 */
test.describe("Coaching category", () => {
  test.describe("Functional", () => {
    /* TC-COACH-301 */
    test(
      "TC-COACH-301: Owner creates a category with a name only",
      {
        tag: [
          Tag.Smoke,
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingCategory,
        ],
      },
      async ({ coachingCategoryListPage }) => {
        const category = buildCoachingCategory();

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.createCategory(category.name);

        await expect(coachingCategoryListPage.categoryRow(category.name)).toBeVisible();
      },
    );

    /* TC-COACH-302 */
    test(
      "TC-COACH-302: Owner creates a category with an image",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ coachingCategoryListPage }) => {
        const category = buildCoachingCategory();

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.createCategoryWithImage(category.name);

        expect(await coachingCategoryListPage.thumbnailSource(category.name)).toContain(
          "images.unsplash.com",
        );
      },
    );

    /* TC-COACH-303 */
    test(
      "TC-COACH-303: Owner renames a category",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ createCategory, coachingCategoryListPage }) => {
        const category = await createCategory();
        const renamed = buildCoachingCategory();

        await coachingCategoryListPage.openEditDialog(category.name);
        await coachingCategoryListPage.updateDialog.fillName(renamed.name);
        await coachingCategoryListPage.saveEdit();

        await expect(coachingCategoryListPage.updateDialog.locators.dialog()).toBeHidden();
        await expect(coachingCategoryListPage.categoryRow(renamed.name)).toBeVisible();

        await coachingCategoryListPage.searchExpectingNoResults(category.name);
        await expect(coachingCategoryListPage.locators.noData()).toBeVisible();
      },
    );

    /* TC-COACH-304 */
    test(
      "TC-COACH-304: Owner replaces a category's image",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ createCategory, coachingCategoryListPage }) => {
        const category = await createCategory({
          withImage: true,
        });
        const before = await coachingCategoryListPage.thumbnailSource(category.name);

        await coachingCategoryListPage.openEditDialog(category.name);
        await coachingCategoryListPage.updateDialog.removeImage();
        await coachingCategoryListPage.updateDialog.chooseImage(1);
        await coachingCategoryListPage.saveEdit();

        await expect(coachingCategoryListPage.updateDialog.locators.dialog()).toBeHidden();
        await expect(
          coachingCategoryListPage.locators.thumbnail(category.name),
        ).not.toHaveAttribute("src", before);
      },
    );

    /* TC-COACH-305 */
    test(
      "TC-COACH-305: Owner deletes a category",
      {
        tag: [
          Tag.Smoke,
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingCategory,
        ],
      },
      async ({ createCategory, coachingCategoryListPage }) => {
        const category = await createCategory();

        await coachingCategoryListPage.deleteCategory(category.name);

        await expect(coachingCategoryListPage.categoryRow(category.name)).toBeHidden();

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.searchExpectingNoResults(category.name);
        await expect(coachingCategoryListPage.locators.noData()).toBeVisible();
      },
    );

    /* TC-COACH-306 */
    test(
      "TC-COACH-306: Owner cancels deleting a category",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ createCategory, coachingCategoryListPage }) => {
        const category = await createCategory();

        await coachingCategoryListPage.cancelDeleting(category.name);

        await expect(coachingCategoryListPage.deleteDialog.dialog()).toBeHidden();
        await expect(coachingCategoryListPage.categoryRow(category.name)).toBeVisible();
      },
    );

    /* TC-COACH-307 */
    test(
      "TC-COACH-307: A new category can be given to a program",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingCategory,
          Tag.CoachingProgramCreation,
        ],
      },
      async ({ createCategory, createProgram, coachingProgramListPage }) => {
        const category = await createCategory();
        const program = await createProgram({
          category: category.name,
        });

        await coachingProgramListPage.open();
        await coachingProgramListPage.searchFor(program.title);

        await expect(
          coachingProgramListPage.locators.programCell(program.title, category.name),
        ).toBeVisible();
      },
    );

    /* TC-COACH-308 */
    test(
      "TC-COACH-308: Deleting a category that a program uses leaves the program Uncategorized",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({
        createCategory,
        createProgram,
        coachingCategoryListPage,
        coachingProgramListPage,
      }) => {
        const category = await createCategory();
        const program = await createProgram({
          category: category.name,
        });

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.deleteCategory(category.name);

        await coachingProgramListPage.open();
        await coachingProgramListPage.searchFor(program.title);

        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();
        await expect(
          coachingProgramListPage.locators.programCell(program.title, "Uncategorized"),
        ).toBeVisible();
      },
    );
  });

  test.describe("UI", () => {
    /* TC-COACH-320 */
    test(
      "TC-COACH-320: The Add Category dialog shows its fields and Cancel creates nothing",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ coachingCategoryListPage }) => {
        const category = buildCoachingCategory();
        const dialog = coachingCategoryListPage.createDialog.locators;

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.openCreateDialog();

        await expect(dialog.dialog()).toBeVisible();
        await expect(dialog.nameInput()).toBeVisible();
        await expect(dialog.uploadArea()).toBeVisible();
        await expect(dialog.cancelButton()).toBeVisible();
        await expect(dialog.submitButton()).toBeVisible();

        await coachingCategoryListPage.createDialog.fillName(category.name);
        await coachingCategoryListPage.createDialog.cancel();

        await expect(dialog.dialog()).toBeHidden();

        await coachingCategoryListPage.searchExpectingNoResults(category.name);
        await expect(coachingCategoryListPage.locators.noData()).toBeVisible();
      },
    );

    /* TC-COACH-321 */
    test(
      "TC-COACH-321: The Edit dialog shows the saved name and image",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ createCategory, coachingCategoryListPage }) => {
        const category = await createCategory({
          withImage: true,
        });
        const dialog = coachingCategoryListPage.updateDialog.locators;

        await coachingCategoryListPage.openEditDialog(category.name);

        await expect(dialog.dialog()).toBeVisible();
        await expect(dialog.nameInput()).toHaveValue(category.name);
        await expect(dialog.imageChosenLabel()).toBeVisible();
      },
    );

    /* TC-COACH-322 */
    test(
      "TC-COACH-322: The delete confirmation warns about programs",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ createCategory, coachingCategoryListPage }) => {
        const category = await createCategory();
        const confirmation = coachingCategoryListPage.deleteDialog;

        await coachingCategoryListPage.openDeleteConfirmation(category.name);

        await expect(confirmation.dialog()).toContainText("Are you sure?");
        await expect(confirmation.dialog()).toContainText("Category will be deleted permanently.");
        await expect(confirmation.dialog()).toContainText(
          "If any coaching program is associated with this category, please update its category before deleting.",
        );
        await expect(confirmation.locators.button("No")).toBeVisible();
        await expect(confirmation.locators.button("Delete")).toBeVisible();

        await confirmation.choose("No");
      },
    );

    /* TC-COACH-323 */
    test(
      "TC-COACH-323: Page size changes how many categories are listed",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ coachingCategoryListPage }) => {
        await coachingCategoryListPage.open();
        await coachingCategoryListPage.setPageSize(5);

        await expect(coachingCategoryListPage.locators.dataRows()).toHaveCount(5);
      },
    );
  });

  test.describe("Validation", () => {
    /* TC-COACH-330 */
    test(
      "TC-COACH-330: Creating without a name shows its message",
      {
        tag: [
          Tag.Smoke,
          Tag.Regression,
          Tag.Owner,
          Tag.Negative,
          Tag.Coaching,
          Tag.CoachingCategory,
        ],
      },
      async ({ coachingCategoryListPage, toast }) => {
        await coachingCategoryListPage.open();
        await coachingCategoryListPage.openCreateDialog();
        await coachingCategoryListPage.submitCreateExpectingMessage(
          CoachingCategoryMessage.nameRequired,
        );

        await expect(toast.message(CoachingCategoryMessage.nameRequired)).toBeVisible();
        await expect(coachingCategoryListPage.createDialog.locators.dialog()).toBeVisible();
      },
    );

    /* TC-COACH-331 */
    test(
      "TC-COACH-331: Saving an edit without a name shows its message",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ createCategory, coachingCategoryListPage, toast }) => {
        const category = await createCategory();

        await coachingCategoryListPage.openEditDialog(category.name);
        await coachingCategoryListPage.updateDialog.fillName("");
        await coachingCategoryListPage.submitEditExpectingMessage(
          CoachingCategoryMessage.nameRequired,
        );

        await expect(toast.message(CoachingCategoryMessage.nameRequired)).toBeVisible();
        await expect(coachingCategoryListPage.updateDialog.locators.dialog()).toBeVisible();

        await coachingCategoryListPage.updateDialog.cancel();
        await coachingCategoryListPage.searchFor(category.name);
        await expect(coachingCategoryListPage.categoryRow(category.name)).toBeVisible();
      },
    );

    /* TC-COACH-332 */
    test(
      "TC-COACH-332: A name of 31 characters is refused",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ coachingCategoryListPage, toast }) => {
        const name = buildCoachingCategoryNameOfLength(31);

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.openCreateDialog();
        await coachingCategoryListPage.createDialog.fillName(name);
        await coachingCategoryListPage.submitCreateExpectingMessage(
          CoachingCategoryMessage.nameTooLong,
        );

        await expect(toast.message(CoachingCategoryMessage.nameTooLong)).toBeVisible();
        await expect(coachingCategoryListPage.createDialog.locators.dialog()).toBeVisible();

        await coachingCategoryListPage.createDialog.cancel();
        await coachingCategoryListPage.searchExpectingNoResults(name);
        await expect(coachingCategoryListPage.locators.noData()).toBeVisible();
      },
    );

    /* TC-COACH-333 */
    test(
      "TC-COACH-333: A name of exactly 30 characters is accepted",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ coachingCategoryListPage }) => {
        const name = buildCoachingCategoryNameOfLength(30);

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.createCategory(name);

        await expect(coachingCategoryListPage.categoryRow(name)).toBeVisible();
      },
    );

    /* TC-COACH-334 */
    test(
      "TC-COACH-334: Searching for a name that does not exist shows No Data",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingCategory],
      },
      async ({ coachingCategoryListPage }) => {
        const unknown = buildCoachingCategory();

        await coachingCategoryListPage.open();
        await coachingCategoryListPage.searchExpectingNoResults(unknown.name);

        await expect(coachingCategoryListPage.locators.noData()).toBeVisible();
        await expect(coachingCategoryListPage.locators.dataRows()).toHaveCount(0);
      },
    );
  });
});
