import type { Page } from "@playwright/test";

import { CoachingProgramFormComponent } from "@/components/coaching-program-form/coaching-program-form.component";
import { ConfirmDialogComponent } from "@/components/confirm-dialog/confirm-dialog.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { CoachingProgramMessage } from "@/helpers/coaching-program-messages";
import type { CoachingProgramData } from "@/helpers/data/coaching-program.factory";
import { BasePage } from "@/pages/base/base.page";
import { CoachingProgramCreateLocators } from "@/pages/owner/coaching-program-create/coaching-program-create.locators";
import { CoachingProgramEditPage } from "@/pages/owner/coaching-program-edit/coaching-program-edit.page";

/*
 * Every method returns only after the screen visibly shows its result. The address bar is never
 * used as proof, because the URL can change before the screen has finished updating.
 */
export class CoachingProgramCreatePage extends BasePage {
  readonly locators: CoachingProgramCreateLocators;
  readonly form: CoachingProgramFormComponent;
  /* The "Booking Not Enabled" warning shown for a one-to-one program created without booking. */
  readonly bookingWarningDialog: ConfirmDialogComponent;
  /*
   * Titles of programs whose creation was submitted. A title is recorded the moment the submit
   * went through, because from then on the program exists even if a later wait times out. The
   * fixture deletes every recorded title when the test ends.
   */
  readonly submittedTitles: Array<string> = [];
  private readonly toast: ToastComponent;
  private readonly editPage: CoachingProgramEditPage;

  constructor(page: Page) {
    super(page);
    this.locators = new CoachingProgramCreateLocators(page);
    this.form = new CoachingProgramFormComponent(page);
    this.bookingWarningDialog = new ConfirmDialogComponent(page);
    this.toast = new ToastComponent(page);
    this.editPage = new CoachingProgramEditPage(page);
  }

  /* Returns once the create form is on screen. */
  waitUntilReady = async (): Promise<void> => {
    await this.locators.heading().waitFor({
      state: "visible",
    });
    await this.form.locators.createButton().waitFor({
      state: "visible",
    });
  };

  /* Opens the create form directly and returns once it is on screen. */
  open = async (): Promise<void> => {
    await this.goto("/dashboard/coaching/coaching-programs/create/");
    await this.waitUntilReady();
  };

  /*
   * Fills the form and clicks Create. It returns only once the success toast has been shown AND
   * the edit form has loaded the new program's title. A one-to-one program without booking always
   * asks "Booking Not Enabled", so it is confirmed here with Continue Anyway.
   */
  create = async (data: CoachingProgramData): Promise<void> => {
    await this.form.fill(data);
    await this.form.locators.createButton().click();
    if (data.coachingType === "One to One Coaching" && data.booking === undefined)
      await this.bookingWarningDialog.choose("Continue Anyway");
    this.submittedTitles.push(data.title);
    await this.toast.message(CoachingProgramMessage.created).waitFor({
      state: "visible",
    });
    await this.editPage.waitUntilLoaded(data.title);
  };

  /* Clicks Create on an incomplete form and returns once a validation message is shown. */
  submitExpectingValidationErrors = async (): Promise<void> => {
    await this.form.locators.createButton().click();
    await this.form.locators.anyValidationMessage().waitFor({
      state: "visible",
    });
  };

  /* Clicks Create on a one-to-one form without booking and returns once the warning is open. */
  submitExpectingBookingWarning = async (): Promise<void> => {
    await this.form.locators.createButton().click();
    await this.bookingWarningDialog.waitUntilOpen();
  };
}
