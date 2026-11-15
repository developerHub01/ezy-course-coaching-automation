import type { Locator, Page } from "@playwright/test";

import { CoachingProgramFormLocators } from "@/components/coaching-program-form/coaching-program-form.locators";
import { GalleryComponent } from "@/components/gallery/gallery.component";
import { SelectDropdownComponent } from "@/components/select-dropdown/select-dropdown.component";
import type {
  AfterCheckoutData,
  CoachingAccess,
  CoachingBookingData,
  CoachingProgramData,
  CoachingType,
  SubmissionVisibility,
} from "@/helpers/data/coaching-program.factory";
import { waitForInputValue } from "@/helpers/wait-for-input-value";

/* The Short Description field keeps at most this many characters. */
export const SHORT_DESCRIPTION_MAX_LENGTH = 160;

/*
 * Every method here returns only after the form visibly shows the result of its action (the value
 * is in the field, the option is chosen, the switch is in its new state, the preview is shown).
 */
export class CoachingProgramFormComponent {
  readonly locators: CoachingProgramFormLocators;
  private readonly selectDropdown: SelectDropdownComponent;
  private readonly gallery: GalleryComponent;

  constructor(page: Page) {
    this.locators = new CoachingProgramFormLocators(page);
    this.selectDropdown = new SelectDropdownComponent(page);
    this.gallery = new GalleryComponent(page);
  }

  fillTitle = async (title: string): Promise<void> => {
    await this.locators.title().fill(title);
    await waitForInputValue(this.locators.title(), title);
  };

  /*
   * Filled in one go (checked: the app accepts it and drops the "Please enter a Description"
   * error). Typing key by key is far slower and can time out when the page is busy.
   */
  fillDescription = async (description: string): Promise<void> => {
    await this.locators.descriptionEditor().fill(description);
    await this.locators.descriptionEditorShowing(description).waitFor({
      state: "visible",
    });
  };

  fillShortDescription = async (shortDescription: string): Promise<void> => {
    await this.locators.shortDescription().fill(shortDescription);
    await waitForInputValue(this.locators.shortDescription(), shortDescription);
  };

  /*
   * For text longer than the field allows. The app keeps only the first 160 characters, so this
   * returns once the field holds exactly that cut-down text.
   */
  fillShortDescriptionOverLimit = async (text: string): Promise<void> => {
    await this.locators.shortDescription().fill(text);
    await waitForInputValue(
      this.locators.shortDescription(),
      text.slice(0, SHORT_DESCRIPTION_MAX_LENGTH),
    );
  };

  selectCategory = async (category: string): Promise<void> => {
    await this.selectDropdown.choose(
      this.locators.categorySelect(),
      category,
      this.locators.categoryChosen(category),
    );
  };

  /* Clicks the radio's visible label (this waits until nothing covers it) and confirms it is checked. */
  private selectRadio = async (radio: Locator): Promise<void> => {
    await this.locators.radioLabel(radio).click();
    await this.locators.checkedRadio(radio).waitFor({
      state: "attached",
    });
  };

  selectAccess = async (access: CoachingAccess): Promise<void> => {
    await this.selectRadio(this.locators.accessRadio(access));
  };

  setStudentLimit = async (limit: number): Promise<void> => {
    await this.locators.studentLimit().fill(String(limit));
    await waitForInputValue(this.locators.studentLimit(), String(limit));
  };

  /* Clicks the + button and returns once the limit shows the next number. */
  increaseStudentLimit = async (): Promise<void> => {
    const before = Number(await this.locators.studentLimit().inputValue());
    await this.locators.increaseStudentLimitButton().click();
    await waitForInputValue(this.locators.studentLimit(), String(before + 1));
  };

  selectCoachingType = async (type: CoachingType): Promise<void> => {
    await this.selectRadio(this.locators.coachingTypeRadio(type));
  };

  selectSubmissionVisibility = async (visibility: SubmissionVisibility): Promise<void> => {
    await this.selectRadio(this.locators.submissionVisibilityRadio(visibility));
  };

  /* setChecked clicks the switch and then verifies that it really reached the wanted state. */
  setAllowSubmissionOnPreviousSessions = async (allowed: boolean): Promise<void> => {
    await this.locators.allowSubmissionOnPreviousSessionsSwitch().setChecked(allowed);
  };

  setAllowEnrollmentInCurrentBatch = async (allowed: boolean): Promise<void> => {
    await this.locators.allowEnrollmentInCurrentBatchSwitch().setChecked(allowed);
  };

  setHabitTab = async (enabled: boolean): Promise<void> => {
    await this.locators.habitTabSwitch().setChecked(enabled);
  };

  setBookingEnabled = async (enabled: boolean): Promise<void> => {
    await this.locators.enableBookingSwitch().setChecked(enabled);
  };

  setFreeSlots = async (slots: number): Promise<void> => {
    await this.locators.freeSlotsInput().fill(String(slots));
    await waitForInputValue(this.locators.freeSlotsInput(), String(slots));
  };

  /*
   * Turns booking on and fills its settings. The renewal cycle and the additional-sessions switch
   * only appear once the free slots are above 0, so they are skipped when it is 0.
   */
  configureBooking = async (booking: CoachingBookingData): Promise<void> => {
    await this.setBookingEnabled(true);
    await this.setFreeSlots(booking.freeSlots);
    if (booking.freeSlots > 0) {
      await this.selectRadio(this.locators.renewalCycleRadio(booking.renewalCycle));
      await this.locators
        .allowAdditionalSessionsSwitch()
        .setChecked(booking.allowAdditionalSessions);
    }
    await this.selectDropdown.choose(
      this.locators.appointmentSelect(),
      booking.appointment,
      this.locators.appointmentChosen(booking.appointment),
    );
  };

  /* Clicks the Internal Page tab and returns once it is the active tab. */
  showInternalPageTab = async (): Promise<void> => {
    await this.locators.internalPageTab().click();
    await this.locators.internalPageTabSelected().waitFor({
      state: "visible",
    });
  };

  showExternalPageTab = async (): Promise<void> => {
    await this.locators.externalPageTab().click();
    await this.locators.externalPageTabSelected().waitFor({
      state: "visible",
    });
  };

  /*
   * Chooses a page of the site as the After Checkout page. It returns once the select shows the
   * chosen page. The active tab when the form is submitted decides what is saved.
   */
  selectInternalPage = async (pageTitle: string): Promise<void> => {
    await this.showInternalPageTab();
    await this.selectDropdown.searchAndChoose(
      this.locators.internalPageSelect(),
      pageTitle,
      this.locators.internalPageChosen(pageTitle),
    );
  };

  /* Types an external address. It returns once the field holds it and the preview link shows it. */
  enterExternalUrl = async (url: string): Promise<void> => {
    await this.showExternalPageTab();
    await this.locators.externalPageUrlInput().fill(url);
    await waitForInputValue(this.locators.externalPageUrlInput(), url);
    await this.locators.afterCheckoutLink(url).waitFor({
      state: "visible",
    });
  };

  /* Clicks Reset to default and returns once that control is gone (the page is the default again). */
  resetAfterCheckout = async (): Promise<void> => {
    await this.locators.resetToDefault().click();
    await this.locators.resetToDefault().waitFor({
      state: "hidden",
    });
  };

  setAfterCheckout = async (afterCheckout: AfterCheckoutData): Promise<void> => {
    if (afterCheckout.kind === "internal") await this.selectInternalPage(afterCheckout.pageTitle);
    else await this.enterExternalUrl(afterCheckout.url);
  };

  /* Hovers an info icon and returns once its tooltip is on screen. */
  private showTooltipOf = async (icon: Locator): Promise<void> => {
    await icon.hover();
    await this.locators.tooltip().waitFor({
      state: "visible",
    });
  };

  /* Moves the mouse onto the Title field and returns once no tooltip is on screen. */
  hideTooltip = async (): Promise<void> => {
    await this.locators.title().hover();
    await this.locators.tooltip().waitFor({
      state: "hidden",
    });
  };

  /* Only Private and Restricted have an info icon. */
  showAccessTooltip = async (access: CoachingAccess): Promise<void> => {
    await this.showTooltipOf(this.locators.accessInfoIcon(access));
  };

  showSubmissionVisibilityTooltip = async (visibility: SubmissionVisibility): Promise<void> => {
    await this.showTooltipOf(this.locators.submissionVisibilityInfoIcon(visibility));
  };

  /*
   * Opens the Gallery and picks a stock image, so the test depends on no file of the tenant and adds
   * nothing to it (choosing a stock image does not import it). Returns once the preview is shown.
   */
  selectFeatureImage = async (): Promise<void> => {
    await this.locators.featureImageButton().click();
    await this.gallery.selectItems("Stock images");
    await this.gallery.confirmSelection();
    await this.locators.featureImagePreview().waitFor({
      state: "visible",
    });
  };

  selectBannerImage = async (): Promise<void> => {
    await this.locators.bannerImageButton().click();
    await this.gallery.selectItems("Stock images");
    await this.gallery.confirmSelection();
    await this.locators.bannerImagePreview().waitFor({
      state: "visible",
    });
  };

  /*
   * Fills every field for the given data, in the order the form needs: the coaching type comes
   * before its extra settings because those only appear after the type is chosen. Settings the data
   * does not mention are left at their defaults. It does not submit.
   */
  fill = async (data: CoachingProgramData): Promise<void> => {
    await this.fillTitle(data.title);
    await this.fillDescription(data.description);
    await this.fillShortDescription(data.shortDescription);
    await this.selectCategory(data.category);
    await this.selectAccess(data.access);
    await this.setStudentLimit(data.studentLimit);
    await this.selectCoachingType(data.coachingType);
    if (data.submissionVisibility !== undefined)
      await this.selectSubmissionVisibility(data.submissionVisibility);
    if (data.allowSubmissionOnPreviousSessions !== undefined)
      await this.setAllowSubmissionOnPreviousSessions(data.allowSubmissionOnPreviousSessions);
    if (data.allowEnrollmentInCurrentBatch !== undefined)
      await this.setAllowEnrollmentInCurrentBatch(data.allowEnrollmentInCurrentBatch);
    if (data.habitTab !== undefined) await this.setHabitTab(data.habitTab);
    if (data.booking !== undefined) await this.configureBooking(data.booking);
    if (data.afterCheckout !== undefined) await this.setAfterCheckout(data.afterCheckout);
    await this.selectFeatureImage();
    await this.selectBannerImage();
  };
}
