import { expect, test } from "@/fixtures";
import {
  DEFAULT_AFTER_CHECKOUT_LINK,
  INTERNAL_AFTER_CHECKOUT_LINK,
} from "@/helpers/coaching-links";
import {
  ALTERNATIVE_COACHING_APPOINTMENT,
  buildCoachingBooking,
  buildCoachingProgram,
  buildExternalAfterCheckout,
  buildInternalAfterCheckout,
} from "@/helpers/data/coaching-program.factory";
import type { CoachingType } from "@/helpers/data/coaching-program.factory";
import { Tag } from "@/helpers/tags";

/*
 * Test cases: src/tests/owner/coaching-program-edit/test-cases/coaching-program-edit.md
 * Each test makes the program it edits with the createProgram fixture (that is only its starting
 * point). The fixture deletes every program the test made when the test ends, even if the test
 * changed its title.
 */

const coachingTypes: Array<CoachingType> = [
  "Week Based",
  "Continuous",
  "Session Based",
  "Evergreen",
  "One to One Coaching",
];

test.describe("Coaching program edit", () => {
  test.describe("Functional", () => {
    /* TC-COACH-201 */
    test(
      "TC-COACH-201: Owner edits the basic details of a program",
      {
        tag: [
          Tag.Smoke,
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingAccess,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          coachingType: "Session Based",
          access: "Public",
          studentLimit: 5,
        });
        const changes = buildCoachingProgram({
          category: "Technology",
          access: "Private",
          studentLimit: 8,
        });
        const formPage = coachingProgramEditPage.form;
        const form = formPage.locators;
        const list = coachingProgramListPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await formPage.fillTitle(changes.title);
        await formPage.fillDescription(changes.description);
        await formPage.fillShortDescription(changes.shortDescription);
        await formPage.selectCategory(changes.category);
        await formPage.selectAccess(changes.access);
        await formPage.setStudentLimit(changes.studentLimit);
        await coachingProgramEditPage.update();

        await coachingProgramListPage.searchFor(changes.title);
        await expect(list.programCell(changes.title, "Technology")).toBeVisible();
        await expect(list.programCell(changes.title, "PRIVATE")).toBeVisible();
        await expect(list.programCell(changes.title, "8")).toBeVisible();

        await coachingProgramListPage.openEditForm(changes.title);
        await expect(form.title()).toHaveValue(changes.title);
        await expect(form.descriptionEditor()).toContainText(changes.description);
        await expect(form.shortDescription()).toHaveValue(changes.shortDescription);
        await expect(form.categoryChosen("Technology")).toBeVisible();
        await expect(form.accessRadio("Private")).toBeChecked();
        await expect(form.studentLimit()).toHaveValue("8");
      },
    );

    /* TC-COACH-202 */
    test(
      "TC-COACH-202: Owner edits the Week Based settings of a program",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingType,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          coachingType: "Week Based",
          submissionVisibility: "All",
          allowSubmissionOnPreviousSessions: false,
          habitTab: true,
        });
        const formPage = coachingProgramEditPage.form;
        const form = formPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await formPage.selectSubmissionVisibility("Own");
        await formPage.setAllowSubmissionOnPreviousSessions(true);
        await formPage.setHabitTab(false);
        await coachingProgramEditPage.update();

        await coachingProgramListPage.openEditForm(program.title);
        await expect(form.submissionVisibilityRadio("Own")).toBeChecked();
        await expect(form.allowSubmissionOnPreviousSessionsSwitch()).toBeChecked();
        await expect(form.habitTabSwitch()).not.toBeChecked();
      },
    );

    /* TC-COACH-203 */
    test(
      "TC-COACH-203: Owner edits the Continuous settings of a program",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingType,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          coachingType: "Continuous",
          allowEnrollmentInCurrentBatch: false,
          allowSubmissionOnPreviousSessions: true,
        });
        const formPage = coachingProgramEditPage.form;
        const form = formPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await formPage.setAllowEnrollmentInCurrentBatch(true);
        await formPage.setAllowSubmissionOnPreviousSessions(false);
        await coachingProgramEditPage.update();

        await coachingProgramListPage.openEditForm(program.title);
        await expect(form.allowEnrollmentInCurrentBatchSwitch()).toBeChecked();
        await expect(form.allowSubmissionOnPreviousSessionsSwitch()).not.toBeChecked();
      },
    );

    /* TC-COACH-204 */
    test(
      "TC-COACH-204: Owner edits the booking settings of a One to One program",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingType,
          Tag.OneToOneBooking,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          coachingType: "One to One Coaching",
          booking: buildCoachingBooking({
            freeSlots: 1,
            renewalCycle: "Monthly",
            allowAdditionalSessions: false,
          }),
        });
        const changes = buildCoachingBooking({
          freeSlots: 3,
          renewalCycle: "Yearly",
          allowAdditionalSessions: true,
          appointment: ALTERNATIVE_COACHING_APPOINTMENT,
        });
        const formPage = coachingProgramEditPage.form;
        const form = formPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await formPage.setFreeSlots(changes.freeSlots);
        await formPage.selectRenewalCycle(changes.renewalCycle);
        await formPage.setAllowAdditionalSessions(changes.allowAdditionalSessions);
        await formPage.selectAppointment(changes.appointment);
        await coachingProgramEditPage.update();

        await coachingProgramListPage.openEditForm(program.title);
        await expect(form.enableBookingSwitch()).toBeChecked();
        await expect(form.freeSlotsInput()).toHaveValue("3");
        await expect(form.renewalCycleRadio("Yearly")).toBeChecked();
        await expect(form.allowAdditionalSessionsSwitch()).toBeChecked();
        await expect(form.appointmentChosen(changes.appointment)).toBeVisible();
      },
    );

    /* TC-COACH-205 */
    test(
      "TC-COACH-205: Owner replaces the feature and banner images",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.Coaching, Tag.CoachingProgramEdit],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram();
        const formPage = coachingProgramEditPage.form;
        const form = formPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await formPage.deleteFeatureImage();
        await formPage.selectFeatureImage();
        await formPage.deleteBannerImage();
        await formPage.selectBannerImage();

        await expect(form.featureImagePreview()).toBeVisible();
        await expect(form.bannerImagePreview()).toBeVisible();

        await coachingProgramEditPage.update();
        await coachingProgramListPage.openEditForm(program.title);

        await expect(form.featureImagePreview()).toBeVisible();
        await expect(form.bannerImagePreview()).toBeVisible();
      },
    );

    /* TC-COACH-206 */
    test(
      "TC-COACH-206: Owner changes the After Checkout page to an external address",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingAfterCheckout,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          afterCheckout: buildInternalAfterCheckout(),
        });
        const external = buildExternalAfterCheckout();
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await coachingProgramEditPage.form.enterExternalUrl(external.url);
        await coachingProgramEditPage.update();

        await coachingProgramListPage.openEditForm(program.title);
        await expect(form.externalPageTabSelected()).toBeVisible();
        await expect(form.afterCheckoutLink(external.url)).toBeVisible();
        await expect(form.resetToDefault()).toBeVisible();
      },
    );

    /* TC-COACH-207 */
    test(
      "TC-COACH-207: Owner resets the After Checkout page to the default",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingAfterCheckout,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          afterCheckout: buildInternalAfterCheckout(),
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await coachingProgramEditPage.form.resetAfterCheckout();
        await coachingProgramEditPage.update();

        await coachingProgramListPage.openEditForm(program.title);
        await expect(form.afterCheckoutLink(DEFAULT_AFTER_CHECKOUT_LINK)).toBeVisible();
        await expect(form.resetToDefault()).toBeHidden();
      },
    );

    /* TC-COACH-208 */
    test(
      "TC-COACH-208: Saving a form without changes keeps every value",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramEdit,
          Tag.CoachingAccess,
          Tag.CoachingType,
          Tag.CoachingAfterCheckout,
        ],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram({
          coachingType: "Week Based",
          access: "Private",
          studentLimit: 5,
          submissionVisibility: "Own",
          allowSubmissionOnPreviousSessions: true,
          habitTab: true,
          afterCheckout: buildInternalAfterCheckout(),
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await coachingProgramEditPage.update();

        await coachingProgramListPage.openEditForm(program.title);
        await expect(form.title()).toHaveValue(program.title);
        await expect(form.studentLimit()).toHaveValue("5");
        await expect(form.accessRadio("Private")).toBeChecked();
        await expect(form.submissionVisibilityRadio("Own")).toBeChecked();
        await expect(form.allowSubmissionOnPreviousSessionsSwitch()).toBeChecked();
        await expect(form.habitTabSwitch()).toBeChecked();
        await expect(form.internalPageTabSelected()).toBeVisible();
        await expect(form.afterCheckoutLink(INTERNAL_AFTER_CHECKOUT_LINK)).toBeVisible();
        await expect(form.featureImagePreview()).toBeVisible();
        await expect(form.bannerImagePreview()).toBeVisible();
      },
    );

    /* TC-COACH-209 */
    test(
      "TC-COACH-209: Back without saving discards the changes",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramEdit],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram();
        const unsavedTitle = `${program.title} UNSAVED`;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await coachingProgramEditPage.form.fillTitle(unsavedTitle);
        await coachingProgramEditPage.goBack();

        await coachingProgramListPage.searchFor(program.title);
        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();

        await coachingProgramListPage.searchExpectingNoResults(unsavedTitle);
        await expect(coachingProgramListPage.locators.dataRows()).toHaveCount(0);
      },
    );
  });

  test.describe("UI", () => {
    /* TC-COACH-210: one test per coaching type */
    for (const type of coachingTypes) {
      test(
        `TC-COACH-210: ${type} edit form locks the type and offers the right tabs`,
        {
          tag: [
            Tag.Regression,
            Tag.Owner,
            Tag.Positive,
            Tag.Coaching,
            Tag.CoachingProgramEdit,
            Tag.CoachingType,
          ],
        },
        async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
          const program = await createProgram({
            coachingType: type,
          });
          const form = coachingProgramEditPage.form.locators;
          const edit = coachingProgramEditPage.locators;

          await coachingProgramListPage.open();
          await coachingProgramListPage.openEditForm(program.title);

          await expect(edit.tab("Details")).toBeVisible();
          await expect(edit.tab("Pricing")).toBeVisible();
          await expect(edit.tab("Drip")).toBeVisible({
            visible: type === "Session Based",
          });
          await expect(form.coachingTypeRadio(type)).toBeChecked();
          for (const option of coachingTypes)
            await expect(form.coachingTypeRadio(option)).toBeDisabled();
        },
      );
    }
  });

  test.describe("Validation", () => {
    /* TC-COACH-220 */
    test(
      "TC-COACH-220: Required fields on edit show their messages",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramEdit],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage }) => {
        const program = await createProgram();
        const formPage = coachingProgramEditPage.form;
        const form = formPage.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await formPage.fillTitle("");
        await formPage.clearDescription();
        await formPage.fillShortDescription("");
        await formPage.deleteFeatureImage();
        await formPage.deleteBannerImage();
        await coachingProgramEditPage.submitExpectingValidationErrors();

        const messages = [
          "Please input the coaching program title!",
          "Description cannot be empty",
          'Provide coaching program"s short description!',
          "Please upload a feature image",
          "Please upload a banner image",
        ];
        for (const message of messages) await expect(form.validationMessage(message)).toBeVisible();
        await expect(coachingProgramEditPage.locators.heading()).toBeVisible();

        await coachingProgramEditPage.goBack();
        await coachingProgramListPage.searchFor(program.title);
        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();
      },
    );

    /* TC-COACH-221 */
    test(
      "TC-COACH-221: A Title of only spaces is not saved",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramEdit],
      },
      async ({ createProgram, coachingProgramListPage, coachingProgramEditPage, toast }) => {
        const program = await createProgram();

        await coachingProgramListPage.open();
        await coachingProgramListPage.openEditForm(program.title);
        await coachingProgramEditPage.form.fillTitle("   ");
        await coachingProgramEditPage.submitExpectingMessage("title cannot be empty");

        await expect(toast.message("title cannot be empty")).toBeVisible();
        await expect(coachingProgramEditPage.locators.heading()).toBeVisible();

        await coachingProgramEditPage.goBack();
        await coachingProgramListPage.searchFor(program.title);
        await expect(coachingProgramListPage.programRow(program.title)).toBeVisible();
      },
    );
  });
});
