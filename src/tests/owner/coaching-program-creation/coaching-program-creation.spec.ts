import { SHORT_DESCRIPTION_MAX_LENGTH } from "@/components/coaching-program-form/coaching-program-form.component";
import { expect, test } from "@/fixtures";
import {
  DEFAULT_COACHING_INTERNAL_PAGE_SLUG,
  buildCoachingBooking,
  buildCoachingProgram,
  buildExternalAfterCheckout,
  buildInternalAfterCheckout,
} from "@/helpers/data/coaching-program.factory";
import type { CoachingType } from "@/helpers/data/coaching-program.factory";
import { getSiteUrl } from "@/helpers/env";
import { Tag } from "@/helpers/tags";

/*
 * Test cases: src/tests/owner/coaching-program-creation/test-cases/coaching-program-creation.md
 * Programs created through coachingProgramCreatePage.create() are deleted automatically by the
 * fixture when the test ends, whether it passed or failed.
 */

/* Where a student goes after checkout when the owner sets nothing, and for the test page. */
const defaultAfterCheckoutLink = new URL("/student/dashboard/coaching-programs", getSiteUrl()).href;
const internalAfterCheckoutLink = new URL(`/${DEFAULT_COACHING_INTERNAL_PAGE_SLUG}`, getSiteUrl())
  .href;

interface TypeSettings {
  type: CoachingType;
  submissionVisibility: boolean;
  allowSubmissionOnPreviousSessions: boolean;
  allowEnrollmentInCurrentBatch: boolean;
  habitTab: boolean;
  enableBooking: boolean;
}

/* TC-COACH-011: which settings each coaching type shows. */
const typeSettings: Array<TypeSettings> = [
  {
    type: "Week Based",
    submissionVisibility: true,
    allowSubmissionOnPreviousSessions: true,
    allowEnrollmentInCurrentBatch: false,
    habitTab: true,
    enableBooking: false,
  },
  {
    type: "Continuous",
    submissionVisibility: true,
    allowSubmissionOnPreviousSessions: true,
    allowEnrollmentInCurrentBatch: true,
    habitTab: true,
    enableBooking: false,
  },
  {
    type: "Session Based",
    submissionVisibility: true,
    allowSubmissionOnPreviousSessions: false,
    allowEnrollmentInCurrentBatch: false,
    habitTab: true,
    enableBooking: false,
  },
  {
    type: "Evergreen",
    submissionVisibility: false,
    allowSubmissionOnPreviousSessions: false,
    allowEnrollmentInCurrentBatch: false,
    habitTab: false,
    enableBooking: false,
  },
  {
    type: "One to One Coaching",
    submissionVisibility: false,
    allowSubmissionOnPreviousSessions: false,
    allowEnrollmentInCurrentBatch: false,
    habitTab: false,
    enableBooking: true,
  },
];

test.describe("Coaching program creation", () => {
  test.describe("Functional", () => {
    /* TC-COACH-001 */
    test(
      "TC-COACH-001: Owner creates a Session Based program",
      {
        tag: [
          Tag.Smoke,
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const data = buildCoachingProgram();

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await coachingProgramEditPage.goBack();
        await coachingProgramListPage.searchFor(data.title);
        const row = coachingProgramListPage.programRow(data.title);
        await expect(row).toContainText("Session");
        await expect(row).toContainText(data.category);
        await expect(row).toContainText("PUBLIC");
      },
    );

    /* TC-COACH-002 */
    test(
      "TC-COACH-002: Owner creates a Week Based program with its extra settings",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.CoachingAccess,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const data = buildCoachingProgram({
          coachingType: "Week Based",
          access: "Private",
          submissionVisibility: "Own",
          allowSubmissionOnPreviousSessions: true,
          habitTab: true,
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await expect(form.submissionVisibilityRadio("Own")).toBeChecked();
        await expect(form.allowSubmissionOnPreviousSessionsSwitch()).toBeChecked();
        await expect(form.habitTabSwitch()).toBeChecked();

        await coachingProgramEditPage.goBack();
        await coachingProgramListPage.searchFor(data.title);
        const row = coachingProgramListPage.programRow(data.title);
        await expect(row).toContainText("Week");
        await expect(row).toContainText("PRIVATE");
      },
    );

    /* TC-COACH-003 */
    test(
      "TC-COACH-003: Owner creates a Continuous program with its extra settings",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.CoachingAccess,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const data = buildCoachingProgram({
          coachingType: "Continuous",
          access: "Restricted",
          allowEnrollmentInCurrentBatch: true,
          allowSubmissionOnPreviousSessions: true,
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await expect(form.allowSubmissionOnPreviousSessionsSwitch()).toBeChecked();
        await expect(form.allowEnrollmentInCurrentBatchSwitch()).toBeChecked();

        await coachingProgramEditPage.goBack();
        await coachingProgramListPage.searchFor(data.title);
        const row = coachingProgramListPage.programRow(data.title);
        await expect(row).toContainText("Continuous");
        await expect(row).toContainText("RESTRICTED");
      },
    );

    /* TC-COACH-004 */
    test(
      "TC-COACH-004: Owner creates an Evergreen program",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.CoachingAccess,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const data = buildCoachingProgram({
          coachingType: "Evergreen",
          access: "Hidden",
        });

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await coachingProgramEditPage.goBack();
        await coachingProgramListPage.searchFor(data.title);
        const row = coachingProgramListPage.programRow(data.title);
        await expect(row).toContainText("Evergreen");
        await expect(row).toContainText("HIDDEN");
      },
    );

    /* TC-COACH-005 */
    test(
      "TC-COACH-005: Owner creates a One to One program with booking",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.OneToOneBooking,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const booking = buildCoachingBooking({
          freeSlots: 2,
          renewalCycle: "Weekly",
          allowAdditionalSessions: true,
        });
        const data = buildCoachingProgram({
          coachingType: "One to One Coaching",
          booking,
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await expect(form.enableBookingSwitch()).toBeChecked();
        await expect(form.freeSlotsInput()).toHaveValue("2");
        await expect(form.renewalCycleRadio("Weekly")).toBeChecked();
        await expect(form.allowAdditionalSessionsSwitch()).toBeChecked();
        await expect(form.appointmentChosen(booking.appointment)).toBeVisible();
      },
    );

    /* TC-COACH-006 */
    test(
      "TC-COACH-006: Owner creates a One to One program without booking",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.OneToOneBooking,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const data = buildCoachingProgram({
          coachingType: "One to One Coaching",
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await expect(form.enableBookingSwitch()).toBeDisabled();
      },
    );

    /* TC-COACH-007 */
    test(
      "TC-COACH-007: Owner sets a page of the site as the After Checkout page",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingAfterCheckout,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const data = buildCoachingProgram({
          afterCheckout: buildInternalAfterCheckout(),
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await expect(form.internalPageTabSelected()).toBeVisible();
        await expect(form.afterCheckoutLink(internalAfterCheckoutLink)).toBeVisible();
        await expect(form.resetToDefault()).toBeVisible();
      },
    );

    /* TC-COACH-008 */
    test(
      "TC-COACH-008: Owner sets an external address as the After Checkout page",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingAfterCheckout,
        ],
      },
      async ({ coachingProgramListPage, coachingProgramCreatePage, coachingProgramEditPage }) => {
        const afterCheckout = buildExternalAfterCheckout();
        const data = buildCoachingProgram({
          afterCheckout,
        });
        const form = coachingProgramEditPage.form.locators;

        await coachingProgramListPage.open();
        await coachingProgramListPage.openCreateForm();
        await coachingProgramCreatePage.create(data);

        await expect(form.externalPageTabSelected()).toBeVisible();
        await expect(form.afterCheckoutLink(afterCheckout.url)).toBeVisible();
        await expect(form.resetToDefault()).toBeVisible();
      },
    );
  });

  test.describe("UI", () => {
    /* TC-COACH-011: one test per coaching type */
    for (const settings of typeSettings) {
      test(
        `TC-COACH-011: ${settings.type} shows only its own settings`,
        {
          tag: [
            Tag.Regression,
            Tag.Owner,
            Tag.Positive,
            Tag.Coaching,
            Tag.CoachingProgramCreation,
            Tag.CoachingType,
          ],
        },
        async ({ coachingProgramCreatePage }) => {
          const form = coachingProgramCreatePage.form.locators;

          await coachingProgramCreatePage.open();
          await coachingProgramCreatePage.form.selectCoachingType(settings.type);

          await expect(form.radioLabel(form.submissionVisibilityRadio("All"))).toBeVisible({
            visible: settings.submissionVisibility,
          });
          await expect(form.allowSubmissionOnPreviousSessionsSwitch()).toBeVisible({
            visible: settings.allowSubmissionOnPreviousSessions,
          });
          await expect(form.allowEnrollmentInCurrentBatchSwitch()).toBeVisible({
            visible: settings.allowEnrollmentInCurrentBatch,
          });
          await expect(form.habitTabSwitch()).toBeVisible({
            visible: settings.habitTab,
          });
          await expect(form.enableBookingSwitch()).toBeVisible({
            visible: settings.enableBooking,
          });
        },
      );
    }

    /* TC-COACH-012 */
    test(
      "TC-COACH-012: One to One booking settings appear step by step",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.OneToOneBooking,
        ],
      },
      async ({ coachingProgramCreatePage }) => {
        const formPage = coachingProgramCreatePage.form;
        const form = formPage.locators;

        await coachingProgramCreatePage.open();
        await formPage.selectCoachingType("One to One Coaching");

        await expect(form.enableBookingSwitch()).toBeVisible();
        await expect(form.enableBookingSwitch()).not.toBeChecked();
        await expect(form.freeSlotsInput()).toBeHidden();

        await formPage.setBookingEnabled(true);

        await expect(form.freeSlotsInput()).toBeVisible();
        await expect(form.appointmentSelect()).toBeVisible();
        await expect(form.radioLabel(form.renewalCycleRadio("One-time"))).toBeHidden();
        await expect(form.allowAdditionalSessionsSwitch()).toBeHidden();

        await formPage.setFreeSlots(1);

        for (const cycle of ["One-time", "Weekly", "Monthly", "Yearly"] as const)
          await expect(form.radioLabel(form.renewalCycleRadio(cycle))).toBeVisible();
        await expect(form.renewalCycleRadio("One-time")).toBeChecked();
        await expect(form.allowAdditionalSessionsSwitch()).toBeVisible();
      },
    );

    /* TC-COACH-013 */
    test(
      "TC-COACH-013: Access info icons explain Private and Restricted",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingAccess,
        ],
      },
      async ({ coachingProgramCreatePage }) => {
        const formPage = coachingProgramCreatePage.form;
        const form = formPage.locators;

        await coachingProgramCreatePage.open();

        await formPage.showAccessTooltip("Private");
        await expect(form.tooltip()).toHaveText(
          "The coaching program will remain public, but students must first request access from you in order to purchase.",
        );
        await formPage.hideTooltip();

        await formPage.showAccessTooltip("Restricted");
        await expect(form.tooltip()).toHaveText(
          "This coaching program will be visible everywhere, but users won't be able to buy it or send purchase requests.",
        );

        await expect(form.accessInfoIcon("Public")).toHaveCount(0);
        await expect(form.accessInfoIcon("Hidden")).toHaveCount(0);
      },
    );

    /* TC-COACH-014 */
    test(
      "TC-COACH-014: Submission Visibility info icons explain All and Own",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
        ],
      },
      async ({ coachingProgramCreatePage }) => {
        const formPage = coachingProgramCreatePage.form;
        const form = formPage.locators;

        await coachingProgramCreatePage.open();
        await formPage.selectCoachingType("Week Based");

        await formPage.showSubmissionVisibilityTooltip("All");
        await expect(form.tooltip()).toHaveText("All students can see each other's submissions.");
        await formPage.hideTooltip();

        await formPage.showSubmissionVisibilityTooltip("Own");
        await expect(form.tooltip()).toHaveText("Students can only see their own submissions.");
      },
    );

    /* TC-COACH-015 */
    test(
      "TC-COACH-015: After Checkout link shows where the student will go",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Positive,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingAfterCheckout,
        ],
      },
      async ({ coachingProgramCreatePage }) => {
        const formPage = coachingProgramCreatePage.form;
        const form = formPage.locators;
        const external = buildExternalAfterCheckout();

        await coachingProgramCreatePage.open();

        await expect(form.afterCheckoutLink(defaultAfterCheckoutLink)).toBeVisible();
        await expect(form.resetToDefault()).toBeHidden();

        await formPage.selectInternalPage(buildInternalAfterCheckout().pageTitle);
        await expect(form.afterCheckoutLink(internalAfterCheckoutLink)).toBeVisible();
        await expect(form.resetToDefault()).toBeVisible();

        await formPage.enterExternalUrl(external.url);
        await expect(form.afterCheckoutLink(external.url)).toBeVisible();

        await formPage.showInternalPageTab();
        await expect(form.afterCheckoutLink(internalAfterCheckoutLink)).toBeVisible();

        await formPage.resetAfterCheckout();
        await expect(form.afterCheckoutLink(defaultAfterCheckoutLink)).toBeVisible();
      },
    );
  });

  test.describe("Validation", () => {
    /* TC-COACH-021 */
    test(
      "TC-COACH-021: Empty form shows every required message",
      {
        tag: [
          Tag.Smoke,
          Tag.Regression,
          Tag.Owner,
          Tag.Negative,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
        ],
      },
      async ({ coachingProgramCreatePage }) => {
        const form = coachingProgramCreatePage.form.locators;

        await coachingProgramCreatePage.open();
        await coachingProgramCreatePage.submitExpectingValidationErrors();

        const messages = [
          "Please input the coaching program title!",
          "Please enter a Description",
          "Please select a category!",
          "Please select coaching program type",
          "Please upload a feature image",
          "Please upload a banner image",
        ];
        for (const message of messages) await expect(form.validationMessage(message)).toBeVisible();
        await expect(coachingProgramCreatePage.locators.heading()).toBeVisible();
      },
    );

    /* TC-COACH-022 */
    test(
      "TC-COACH-022: Short Description keeps at most 160 characters",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramCreation],
      },
      async ({ coachingProgramCreatePage }) => {
        const text = "S".repeat(SHORT_DESCRIPTION_MAX_LENGTH + 40);

        await coachingProgramCreatePage.open();
        await coachingProgramCreatePage.form.fillShortDescriptionOverLimit(text);

        await expect(coachingProgramCreatePage.form.locators.shortDescription()).toHaveValue(
          text.slice(0, SHORT_DESCRIPTION_MAX_LENGTH),
        );
      },
    );

    /* TC-COACH-023 */
    test(
      "TC-COACH-023: Student Limit cannot go below 1",
      {
        tag: [Tag.Regression, Tag.Owner, Tag.Negative, Tag.Coaching, Tag.CoachingProgramCreation],
      },
      async ({ coachingProgramCreatePage }) => {
        const form = coachingProgramCreatePage.form.locators;

        await coachingProgramCreatePage.open();

        await expect(form.studentLimit()).toHaveValue("1");
        await expect(form.decreaseStudentLimitButton()).toBeDisabled();

        await coachingProgramCreatePage.form.increaseStudentLimit();

        await expect(form.studentLimit()).toHaveValue("2");
        await expect(form.decreaseStudentLimitButton()).toBeEnabled();
      },
    );

    /* TC-COACH-024 */
    test(
      "TC-COACH-024: Cancel on the booking warning keeps the form",
      {
        tag: [
          Tag.Regression,
          Tag.Owner,
          Tag.Negative,
          Tag.Coaching,
          Tag.CoachingProgramCreation,
          Tag.CoachingType,
          Tag.OneToOneBooking,
        ],
      },
      async ({ coachingProgramCreatePage }) => {
        const data = buildCoachingProgram({
          coachingType: "One to One Coaching",
        });

        await coachingProgramCreatePage.open();
        await coachingProgramCreatePage.form.fill(data);
        await coachingProgramCreatePage.submitExpectingBookingWarning();

        await expect(coachingProgramCreatePage.bookingWarningDialog.dialog()).toContainText(
          "Warning: Booking Not Enabled",
        );

        await coachingProgramCreatePage.bookingWarningDialog.choose("Cancel");

        await expect(coachingProgramCreatePage.form.locators.title()).toHaveValue(data.title);
      },
    );
  });
});
