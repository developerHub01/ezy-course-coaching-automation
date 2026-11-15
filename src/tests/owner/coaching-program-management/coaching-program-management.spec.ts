import { expect, test } from "@/fixtures";
import { CoachingProgramMessage } from "@/helpers/coaching-program-messages";
import {
  DEFAULT_COACHING_CATEGORY,
  buildCoachingProgram,
} from "@/helpers/data/coaching-program.factory";
import { Tag } from "@/helpers/tags";

/*
 * Test cases: src/tests/owner/coaching-program-management/test-cases/coaching-program-management.md
 * Each test makes the program it works on with the createProgram fixture (that is only its starting
 * point). The fixture deletes whatever program is left when the test ends, and does not try again
 * for one the test already deleted.
 */
test.describe("Coaching program management", () => {
  test.describe("Functional", () => {
    /* TC-COACH-102 */
    test(
      "TC-COACH-102: Owner deletes a program",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingProgramManagement],
      },
      async ({ createProgram, coachingProgramListPage, toast }) => {
        const program = await createProgram();

        await coachingProgramListPage.open();
        await coachingProgramListPage.deleteProgram(program.title);

        await expect(toast.message(CoachingProgramMessage.deleted)).toBeVisible();
        await expect(coachingProgramListPage.programRow(program.title)).toBeHidden();

        await coachingProgramListPage.open();
        await coachingProgramListPage.searchExpectingNoResults(program.title);
        await expect(coachingProgramListPage.locators.dataRows()).toHaveCount(0);
      },
    );

    /* TC-COACH-103 */
    test(
      "TC-COACH-103: Owner cancels deleting a program",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramManagement],
      },
      async ({ createProgram, coachingProgramListPage }) => {
        const program = await createProgram();

        await coachingProgramListPage.open();
        await coachingProgramListPage.cancelDeleting(program.title);

        await expect(coachingProgramListPage.deleteDialog.dialog()).toBeHidden();
        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();
      },
    );

    /* TC-COACH-104 */
    test(
      "TC-COACH-104: Owner finds a program by searching its title",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingProgramManagement],
      },
      async ({ createProgram, coachingProgramListPage }) => {
        const program = await createProgram();

        await coachingProgramListPage.open();
        await coachingProgramListPage.searchFor(program.title);

        await expect(
          coachingProgramListPage.locators.searchResultsLabel(program.title),
        ).toBeVisible();
        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();
      },
    );

    /* TC-COACH-105 */
    test(
      "TC-COACH-105: Owner filters programs by category and session type, then clears the filters",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramManagement,
          Tag.CoachingType,
        ],
      },
      async ({ createProgram, coachingProgramListPage }) => {
        const program = await createProgram({
          coachingType: "Week Based",
        });
        const list = coachingProgramListPage.locators;

        await coachingProgramListPage.open();
        await expect(list.clearFiltersButton()).toBeDisabled();

        await coachingProgramListPage.filterByCategory(DEFAULT_COACHING_CATEGORY);
        await expect(list.clearFiltersButton()).toBeEnabled();

        await coachingProgramListPage.filterBySessionType("Week Based");
        await expect(list.dataRowsWithout("Week")).toHaveCount(0);
        await expect(list.dataRowsWithout(DEFAULT_COACHING_CATEGORY)).toHaveCount(0);

        await coachingProgramListPage.searchFor(program.title);
        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();

        await coachingProgramListPage.clearFilters();
        await expect(list.clearFiltersButton()).toBeDisabled();
      },
    );
  });

  test.describe("UI", () => {
    /* TC-COACH-106 */
    test(
      "TC-COACH-106: The row menu offers its six actions",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingProgramManagement],
      },
      async ({ createProgram, coachingProgramListPage }) => {
        const program = await createProgram();
        const list = coachingProgramListPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openActionMenu(program.title);

        for (const item of [
          "Edit",
          "Delete",
          "Add Coach",
          "Pricing",
          "Preview Checkout",
          "Clients",
        ])
          await expect(list.menuItem(item)).toBeVisible();
      },
    );
  });

  test.describe("Validation", () => {
    /* TC-COACH-112 */
    test(
      "TC-COACH-112: Search with no match shows the empty message",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramManagement],
      },
      async ({ coachingProgramListPage }) => {
        const unknownTitle = buildCoachingProgram().title;
        const list = coachingProgramListPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.searchExpectingNoResults(unknownTitle);

        await expect(list.searchResultsLabel(unknownTitle)).toBeVisible();
        await expect(list.dataRows()).toHaveCount(0);
        await expect(list.noResults()).toBeVisible();
      },
    );
  });
});
