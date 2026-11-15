import type { Page } from "@playwright/test";

import { CoachingProgramFormComponent } from "@/components/coaching-program-form/coaching-program-form.component";
import { ToastComponent } from "@/components/toast/toast.component";
import { CoachingProgramMessage } from "@/helpers/coaching-program-messages";
import { waitForInputValue } from "@/helpers/wait-for-input-value";
import { BasePage } from "@/pages/base/base.page";
import { CoachingProgramEditLocators } from "@/pages/owner/coaching-program-edit/coaching-program-edit.locators";
import { CoachingProgramListLocators } from "@/pages/owner/coaching-program-list/coaching-program-list.locators";

/*
 * Every method returns only after the screen visibly shows its result. The address bar is never
 * used as proof, because the URL can change before the screen has finished updating.
 */
export class CoachingProgramEditPage extends BasePage {
  readonly locators: CoachingProgramEditLocators;
  readonly form: CoachingProgramFormComponent;
  private readonly toast: ToastComponent;
  private readonly listLocators: CoachingProgramListLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CoachingProgramEditLocators(page);
    this.form = new CoachingProgramFormComponent(page);
    this.toast = new ToastComponent(page);
    this.listLocators = new CoachingProgramListLocators(page);
  }

  /*
   * Returns once the edit form is on screen AND shows the program's saved title. The form first
   * renders empty and is filled in after the program has loaded, so the title is the proof.
   */
  waitUntilLoaded = async (title: string): Promise<void> => {
    await this.locators.heading().waitFor({
      state: "visible",
    });
    await waitForInputValue(this.form.locators.title(), title);
  };

  /* Clicks Update and returns once the success toast is shown and the programs list is on screen. */
  update = async (): Promise<void> => {
    await this.form.locators.updateButton().click();
    await this.toast.message(CoachingProgramMessage.updated).waitFor({
      state: "visible",
    });
    await this.listLocators.heading().waitFor({
      state: "visible",
    });
  };

  /* Clicks Update on an invalid form and returns once a validation message is shown. */
  submitExpectingValidationErrors = async (): Promise<void> => {
    await this.form.locators.updateButton().click();
    await this.form.locators.anyValidationMessage().waitFor({
      state: "visible",
    });
  };

  /* Clicks the back arrow and returns once the programs list is on screen. */
  goBack = async (): Promise<void> => {
    await this.locators.backButton().click();
    await this.listLocators.heading().waitFor({
      state: "visible",
    });
  };
}
