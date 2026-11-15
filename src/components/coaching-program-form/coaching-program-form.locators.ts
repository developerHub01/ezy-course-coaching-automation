import type { Locator } from "@playwright/test";

import type {
  CoachingAccess,
  CoachingType,
  FreeSlotsRenewalCycle,
  SubmissionVisibility,
} from "@/helpers/data/coaching-program.factory";
import { BaseLocators } from "@/pages/base/base.locators";

/*
 * The coaching program form. The create page and the edit page show the same form, so both pages
 * use this one set of locators.
 */
export class CoachingProgramFormLocators extends BaseLocators {
  /*
   * Several controls have no usable name of their own (a switch is named by its state, the
   * appointment select has no name). They are found through their label: the innermost block that
   * holds both the label text and the control is the one wanted, which is the last match because
   * outer blocks come first in document order.
   */
  private readonly fieldSection = (label: string, control: Locator): Locator =>
    this.page
      .locator("div")
      .filter({
        hasText: label,
      })
      .filter({
        has: control,
      })
      .last();

  /*
   * The real radio input is invisible and sits under Ant Design's styled circle, so clicking it
   * directly is unreliable. A radio is chosen by clicking its visible label, and confirmed by
   * waiting until the input reports itself checked.
   */
  readonly radioLabel = (radio: Locator): Locator =>
    this.page.locator("label").filter({
      has: radio,
    });

  readonly checkedRadio = (radio: Locator): Locator => radio.and(this.page.locator(":checked"));

  /* ---------- Basic fields ---------- */

  readonly title = (): Locator =>
    this.page.getByRole("textbox", {
      name: "* Title",
    });

  /* The rich-text editor is the only unnamed contenteditable textbox, so it has no role/name to use. */
  readonly descriptionEditor = (): Locator =>
    this.page.locator("[contenteditable=true][role=textbox]");

  /* The editor, but only once it shows the given text. */
  readonly descriptionEditorShowing = (text: string): Locator =>
    this.descriptionEditor().filter({
      hasText: text,
    });

  readonly shortDescription = (): Locator =>
    this.page.getByRole("textbox", {
      name: "* Short Description",
    });

  readonly categorySelect = (): Locator =>
    this.page.getByRole("combobox", {
      name: "* Category",
    });

  /* Where the Category select shows its current choice. */
  readonly categoryChosen = (category: string): Locator =>
    this.page
      .locator(".ant-select")
      .filter({
        has: this.categorySelect(),
      })
      .getByTitle(category, {
        exact: true,
      });

  readonly accessRadio = (access: CoachingAccess): Locator =>
    this.page.getByRole("radio", {
      name: access,
    });

  /*
   * The create page does not name this field, while the edit page calls it "* Student Limit". It is
   * the first number input on the form in both cases (the free-slots input comes much later).
   */
  readonly studentLimit = (): Locator => this.page.getByRole("spinbutton").first();

  readonly increaseStudentLimitButton = (): Locator =>
    this.page
      .getByRole("button", {
        name: "Increase Value",
      })
      .first();

  readonly decreaseStudentLimitButton = (): Locator =>
    this.page
      .getByRole("button", {
        name: "Decrease Value",
      })
      .first();

  /* ---------- Coaching type and its extra settings ---------- */

  readonly coachingTypeRadio = (type: CoachingType): Locator =>
    this.page.getByRole("radio", {
      name: type,
      exact: true,
    });

  readonly submissionVisibilityRadio = (visibility: SubmissionVisibility): Locator =>
    this.page.getByRole("radio", {
      name: visibility,
      exact: true,
    });

  /*
   * The small "i" icons next to Private, Restricted, All and Own. Hovering one shows a tooltip that
   * explains the option. Public and Hidden have no icon.
   */
  readonly accessInfoIcon = (access: CoachingAccess): Locator =>
    this.radioLabel(this.accessRadio(access)).locator("svg");

  readonly submissionVisibilityInfoIcon = (visibility: SubmissionVisibility): Locator =>
    this.radioLabel(this.submissionVisibilityRadio(visibility)).locator("svg");

  readonly tooltip = (): Locator => this.page.getByRole("tooltip");

  readonly allowSubmissionOnPreviousSessionsSwitch = (): Locator =>
    this.fieldSection(
      "Allow Submission on Previous Sessions",
      this.page.getByRole("switch"),
    ).getByRole("switch");

  readonly allowEnrollmentInCurrentBatchSwitch = (): Locator =>
    this.fieldSection("Allow Enrollment in Current Batch", this.page.getByRole("switch")).getByRole(
      "switch",
    );

  readonly habitTabSwitch = (): Locator =>
    this.fieldSection("Habit Tab", this.page.getByRole("switch")).getByRole("switch");

  /* ---------- One to One booking ---------- */

  readonly enableBookingSwitch = (): Locator =>
    this.fieldSection("Enable Booking", this.page.getByRole("switch")).getByRole("switch");

  readonly freeSlotsInput = (): Locator =>
    this.page.getByRole("spinbutton", {
      name: "Enter number of allowed free slots",
    });

  readonly renewalCycleRadio = (cycle: FreeSlotsRenewalCycle): Locator =>
    this.page.getByRole("radio", {
      name: cycle,
    });

  readonly allowAdditionalSessionsSwitch = (): Locator =>
    this.fieldSection("Allow Additional Sessions", this.page.getByRole("switch")).getByRole(
      "switch",
    );

  private readonly appointmentSection = (): Locator =>
    this.fieldSection("Select Appointment", this.page.getByRole("combobox"));

  readonly appointmentSelect = (): Locator => this.appointmentSection().getByRole("combobox");

  /* Where the Appointment select shows its current choice. */
  readonly appointmentChosen = (appointment: string): Locator =>
    this.appointmentSection().getByTitle(appointment, {
      exact: true,
    });

  /* ---------- Images ---------- */

  readonly featureImageButton = (): Locator =>
    this.page.getByRole("button", {
      name: "upload-feature-image-btn",
    });

  readonly bannerImageButton = (): Locator =>
    this.page.getByRole("button", {
      name: "upload-banner-image-btn",
    });

  readonly featureImagePreview = (): Locator =>
    this.page.getByRole("img", {
      name: "Program feature preview",
    });

  readonly bannerImagePreview = (): Locator =>
    this.page.getByRole("img", {
      name: "Banner",
      exact: true,
    });

  /* ---------- After Checkout Page URL ---------- */

  private readonly afterCheckoutSection = (): Locator =>
    this.fieldSection("After Checkout Page URL", this.page.getByRole("tab"));

  /*
   * The address shown above the tabs. It is a live preview of where a student will go: the default
   * page, the chosen internal page, or the typed external address, following the active tab.
   */
  readonly afterCheckoutLink = (address: string): Locator =>
    this.afterCheckoutSection().getByRole("link", {
      name: address,
      exact: true,
    });

  readonly internalPageTab = (): Locator =>
    this.afterCheckoutSection().getByRole("tab", {
      name: "Internal Page",
    });

  readonly externalPageTab = (): Locator =>
    this.afterCheckoutSection().getByRole("tab", {
      name: "External Page",
    });

  /* The same tabs, but only while they are the active one. */
  readonly internalPageTabSelected = (): Locator =>
    this.afterCheckoutSection().getByRole("tab", {
      name: "Internal Page",
      selected: true,
    });

  readonly externalPageTabSelected = (): Locator =>
    this.afterCheckoutSection().getByRole("tab", {
      name: "External Page",
      selected: true,
    });

  readonly internalPageSelect = (): Locator =>
    this.afterCheckoutSection().getByRole("tabpanel").getByRole("combobox");

  /* Where the Internal Page select shows its current choice. */
  readonly internalPageChosen = (pageTitle: string): Locator =>
    this.afterCheckoutSection().getByTitle(pageTitle, {
      exact: true,
    });

  readonly externalPageUrlInput = (): Locator =>
    this.afterCheckoutSection().getByRole("textbox", {
      name: "Enter URL",
    });

  /* Appears once the after checkout page is no longer the default. */
  readonly resetToDefault = (): Locator =>
    this.afterCheckoutSection().getByText("Reset to default", {
      exact: true,
    });

  /* ---------- Buttons and messages ---------- */

  readonly createButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Create",
      exact: true,
    });

  readonly updateButton = (): Locator =>
    this.page.getByRole("button", {
      name: "Update",
      exact: true,
    });

  /* Inline validation text under a field, for example "Please select a category!". */
  readonly validationMessage = (text: string): Locator =>
    this.page.getByText(text, {
      exact: true,
    });

  /* Any inline validation message at all. Ant Design marks them with this class. */
  readonly anyValidationMessage = (): Locator =>
    this.page.locator(".ant-form-item-explain-error").first();
}
