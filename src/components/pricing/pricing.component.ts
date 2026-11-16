import type { Page } from "@playwright/test";

import { ConfirmDialogComponent } from "@/components/confirm-dialog/confirm-dialog.component";
import { PricingLocators } from "@/components/pricing/pricing.locators";
import { SelectDropdownComponent } from "@/components/select-dropdown/select-dropdown.component";
import { ToastComponent } from "@/components/toast/toast.component";
import {
  ALL_PRICING_PLANS,
  PRICING_PLAN_FORM_HEADING,
  PRICING_PLAN_LABEL,
} from "@/helpers/data/pricing/pricing.matrix";
import type {
  AdvancedInstallmentData,
  BillingPeriod,
  ExpiryData,
  FlatTierData,
  OneTimeTrialData,
  PriceData,
  PricingPlanType,
  SubscriptionTrialData,
  TierData,
} from "@/helpers/data/pricing/pricing.types";
import { PricingMessage } from "@/helpers/pricing-messages";

/*
 * The pricing section that every product shows on its pricing page: the cards of the existing prices
 * and the add / edit form. One controller serves all products, because the screen is the same. Which
 * plans a product offers, and which settings a plan shows, is data in pricing.matrix.ts, not logic here.
 *
 * Every method returns only after the screen visibly shows its result (the new card is in the list,
 * the toast appeared, the card is gone). The address bar and the API are never used as proof.
 */
export class PricingComponent {
  readonly locators: PricingLocators;
  readonly confirmDialog: ConfirmDialogComponent;
  private readonly selectDropdown: SelectDropdownComponent;
  private readonly toast: ToastComponent;

  constructor(private readonly page: Page) {
    this.locators = new PricingLocators(page);
    this.confirmDialog = new ConfirmDialogComponent(page);
    this.selectDropdown = new SelectDropdownComponent(page);
    this.toast = new ToastComponent(page);
  }

  /* ---------- reading the list ---------- */

  /*
   * Returns once the section is drawn. The add button ("Add a price" or "Add more price") is the one
   * thing every product shows in both states: the empty-state text exists on most products but a
   * new course shows only the button.
   */
  waitUntilLoaded = async (): Promise<void> => {
    await this.locators.addPriceButton().waitFor({
      state: "visible",
    });
    /*
     * The button is drawn before the page has finished loading its data. Clicking it that early
     * sometimes crashes the page ("Application error: a client-side exception has occurred"), most
     * often while the browser is busy recording. Waiting for the network to settle avoids that.
     */
    await this.page.waitForLoadState("networkidle");
  };

  /* The ids ("#322412") of the cards on screen, in page order. */
  priceIds = async (): Promise<Array<string>> => {
    await this.waitUntilLoaded();
    return this.locators.idTags().allInnerTexts();
  };

  priceCount = async (): Promise<number> => (await this.priceIds()).length;

  /* A card, so a spec can assert its text (amounts, tags such as Default or Private). */
  card = (priceId: string): ReturnType<PricingLocators["card"]> => this.locators.card(priceId);

  /*
   * Opens the add form and reports which plans the plan list offers right now. A plan whose limit is
   * reached is not offered (see PRICING_PLAN_MAX_ACTIVE). The form is left open; call cancelForm().
   */
  offeredPlans = async (): Promise<Array<PricingPlanType>> => {
    await this.openAddForm();
    const offered: Array<PricingPlanType> = [];
    for (const plan of ALL_PRICING_PLANS)
      if (await this.locators.planOption(PRICING_PLAN_LABEL[plan]).count()) offered.push(plan);
    return offered;
  };

  /* ---------- add / edit form ---------- */

  openAddForm = async (): Promise<void> => {
    await this.waitUntilLoaded();
    await this.locators.addPriceButton().click();
    await this.locators.form().waitFor({
      state: "visible",
    });
  };

  /* Clicks Cancel and returns once the form is gone. */
  cancelForm = async (): Promise<void> => {
    await this.locators.cancelButton().click();
    await this.locators.form().waitFor({
      state: "hidden",
    });
  };

  /* Picks a plan in the plan list and returns once the form of that plan is drawn. */
  choosePlan = async (plan: PricingPlanType): Promise<void> => {
    await this.locators.planOption(PRICING_PLAN_LABEL[plan]).click();
    await this.locators.formHeading(PRICING_PLAN_FORM_HEADING[plan]).waitFor({
      state: "visible",
    });
    /* Tiered and flat plans share a heading; their tables differ (Per Unit against Price). */
    if (plan === "one-time-tiered" || plan === "subscription-tiered")
      await this.locators.tierHeaderCell("Per Unit").waitFor({
        state: "visible",
      });
    if (plan === "one-time-flat" || plan === "subscription-flat")
      await this.locators.tierHeaderCell("Price").waitFor({
        state: "visible",
      });
  };

  /*
   * Adds a price and returns its id ("#322412"). It returns only once the list shows one more card, and
   * the id .is the one new tag that was not on screen before
   */
  addPrice = async (data: PriceData): Promise<string> => {
    const before = await this.priceIds();
    await this.openAddForm();
    await this.choosePlan(data.plan);
    await this.fillPrice(data);
    await this.locators.createButton().click();
    await this.locators.countHeading(before.length + 1).waitFor({
      state: "visible",
    });
    const created = (await this.priceIds()).find((priceId) => !before.includes(priceId));
    if (created === undefined)
      throw new Error(`A ${data.plan} price was submitted but no new card appeared.`);
    return created;
  };

  /*
   * Fills the add form and presses Create, for cases where the app may refuse the data. It returns
   * "created" once the form has closed, or "rejected" once a message appeared under a field and the
   * form is still open. Nothing is assumed in advance: a spec asserts which one it expected.
   */
  attemptAddPrice = async (data: PriceData): Promise<"created" | "rejected"> => {
    await this.openAddForm();
    await this.choosePlan(data.plan);
    await this.fillPrice(data);
    await this.locators.createButton().click();
    return this.settleSubmit();
  };

  /* Presses Create on whatever the form holds (an empty form, for example) and reports the outcome. */
  attemptCreate = async (): Promise<"created" | "rejected"> => {
    await this.locators.createButton().click();
    return this.settleSubmit();
  };

  /* A message under a field of the open form, so a spec can assert its text. */
  fieldMessage = (message: string): ReturnType<PricingLocators["fieldError"]> =>
    this.locators.fieldError(message);

  /* The button of an item in the open card menu, so a spec can assert it is enabled or disabled. */
  menuButton = (name: string): ReturnType<PricingLocators["menuButton"]> =>
    this.locators.menuButton(name);

  private settleSubmit = async (): Promise<"created" | "rejected"> => {
    const created = this.locators
      .form()
      .waitFor({
        state: "hidden",
      })
      .then(() => "created" as const);
    const rejected = this.locators
      .formAlerts()
      .first()
      .waitFor({
        state: "visible",
      })
      .then(() => "rejected" as const);
    return Promise.any([created, rejected]);
  };

  openEditForm = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Edit").click();
    await this.locators.updateButton().waitFor({
      state: "visible",
    });
  };

  /*
   * Opens the card's edit form, fills it, presses Update and answers the "continue updating this
   * price?" question with Continue. The app does not change the price in place: it replaces it, so
   * the old card disappears and a card with a NEW id appears. The new id is returned.
   */
  updatePrice = async (priceId: string, data: PriceData): Promise<string> => {
    const before = await this.priceIds();
    await this.openEditForm(priceId);
    await this.fillPrice(data);
    await this.locators.updateButton().click();
    await this.confirmDialog.choose("Continue");
    await this.locators.updateButton().waitFor({
      state: "hidden",
    });
    await this.locators.card(priceId).waitFor({
      state: "hidden",
    });
    /* The old card leaves before the list is redrawn, so wait until it holds as many cards as before. */
    await this.locators
      .idTags()
      .nth(before.length - 1)
      .waitFor({
        state: "visible",
      });
    const replacement = (await this.priceIds()).find((id) => !before.includes(id));
    if (replacement === undefined)
      throw new Error(`Price ${priceId} was updated but no replacement card appeared.`);
    return replacement;
  };

  /* ---------- card menu ---------- */

  setAsDefault = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Set as default").click();
    await this.toast.message(PricingMessage.markedDefault).waitFor({
      state: "visible",
    });
    await this.locators.cardTag(priceId, "Default").waitFor({
      state: "visible",
    });
  };

  makePrivate = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Make it private").click();
    await this.toast.message(PricingMessage.madePrivate).waitFor({
      state: "visible",
    });
    await this.locators.cardTag(priceId, "Private").waitFor({
      state: "visible",
    });
  };

  /* Returns once the Private tag is gone from the card. */
  makePublic = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Make it public").click();
    await this.locators.cardTag(priceId, "Private").waitFor({
      state: "hidden",
    });
  };

  copyPaymentUrl = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Copy Payment URL").click();
    await this.toast.message(PricingMessage.linkCopied).waitFor({
      state: "visible",
    });
  };

  /* Archives a price and returns once the toast is shown and the card has left the list. */
  archivePrice = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Archive").click();
    await this.confirmDialog.choose("Archive");
    await this.toast.message(PricingMessage.archived).waitFor({
      state: "visible",
    });
    await this.locators.card(priceId).waitFor({
      state: "hidden",
    });
  };

  /* Starts archiving, answers Cancel, and returns once the dialog is closed and the card is still listed. */
  cancelArchiving = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Archive").click();
    await this.confirmDialog.choose("Cancel");
    await this.locators.card(priceId).waitFor({
      state: "visible",
    });
  };

  deletePrice = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Delete").click();
    await this.confirmDialog.choose("Delete");
    await this.toast.message(PricingMessage.deleted).waitFor({
      state: "visible",
    });
    await this.locators.card(priceId).waitFor({
      state: "hidden",
    });
  };

  cancelDeleting = async (priceId: string): Promise<void> => {
    await this.openMenu(priceId);
    await this.locators.menuItem("Delete").click();
    await this.confirmDialog.choose("Cancel");
    await this.locators.card(priceId).waitFor({
      state: "visible",
    });
  };

  /* Opens the three-dot menu of a card and returns once the menu is on screen. */
  openMenu = async (priceId: string): Promise<void> => {
    await this.locators.cardMenuButton(priceId).click();
    await this.locators.menuItem("Edit").waitFor({
      state: "visible",
    });
  };

  /* ---------- filling the form ---------- */

  /* Fills the open form with the plan's data. Only the fields the data carries are touched. */
  fillPrice = async (data: PriceData): Promise<void> => {
    switch (data.plan) {
      case "one-time-standard":
        await this.fillAmount("Strike Through Price", data.strikeThroughPrice);
        await this.fillAmount("Price", data.price);
        if (data.expiry) await this.fillExpiry(data.expiry, /will expire after/i);
        if (data.trial) await this.fillOneTimeTrial(data.trial);
        return;
      case "split-payment":
        await this.fillAmount("Strike Through Price", data.strikeThroughPrice);
        await this.fillAmount("Amount per installment", data.installmentAmount);
        await this.chooseBillingPeriod(data.billingPeriod);
        await this.fillAdvanced(data.advanced);
        await this.locators.totalInstallments().fill(String(data.totalInstallments));
        if (data.expiry) await this.fillExpiry(data.expiry, "Days after enrollment");
        return;
      case "subscription-standard":
        await this.fillAmount("Strike Through Price", data.strikeThroughPrice);
        await this.fillAmount("Price", data.price);
        await this.chooseBillingPeriod(data.billingPeriod);
        if (data.trial) await this.fillSubscriptionTrial(data.trial);
        await this.fillAdvanced(data.advanced);
        return;
      case "one-time-tiered":
        await this.fillTiers(data.tiers);
        await this.fillDontMultiply(data.dontMultiplyAfter);
        if (data.expiry) await this.fillExpiry(data.expiry, /will expire after/i);
        return;
      case "subscription-tiered":
        await this.fillTiers(data.tiers);
        await this.fillDontMultiply(data.dontMultiplyAfter);
        await this.chooseBillingPeriod(data.billingPeriod);
        if (data.trial) await this.fillSubscriptionTrial(data.trial);
        return;
      case "one-time-flat":
        await this.fillFlatTiers(data.tiers);
        return;
      case "subscription-flat":
        await this.fillFlatTiers(data.tiers);
        await this.chooseBillingPeriod(data.billingPeriod);
        if (data.trial) await this.fillSubscriptionTrial(data.trial);
        return;
      case "donation-one-time":
        await this.fillDonationAmounts(data.presetAmount, data.minimumAmount, data.maximumAmount);
        await this.fillDonationText(data.text);
        if (data.expiry) await this.fillExpiry(data.expiry, "Days after enrollment");
        return;
      case "donation-recurring":
        await this.fillDonationAmounts(data.presetAmount, data.minimumAmount, data.maximumAmount);
        await this.chooseBillingPeriod(data.billingPeriod);
        await this.fillDonationText(data.text);
        return;
    }
  };

  private fillAmount = async (label: string, value: number | undefined): Promise<void> => {
    if (value === undefined) return;
    await this.locators.field(label, "spinbutton").fill(String(value));
  };

  private chooseBillingPeriod = async (period: BillingPeriod): Promise<void> => {
    await this.selectDropdown.choose(
      this.locators.selectBox("Billing period"),
      period,
      this.locators.chosenOption("Billing period", period),
    );
  };

  /* `daysLabel` is the text printed next to the days box once Limited is chosen. */
  private fillExpiry = async (expiry: ExpiryData, daysLabel: string | RegExp): Promise<void> => {
    if (expiry.kind === "lifetime") {
      await this.chooseExpiry("Lifetime");
      return;
    }
    await this.chooseExpiry("Limited");
    await this.locators.field(daysLabel, "spinbutton").fill(String(expiry.days));
  };

  private chooseExpiry = async (choice: "Lifetime" | "Limited"): Promise<void> => {
    await this.locators.expiryChoice(choice).click();
    await this.locators.expiryRadio(choice).and(this.page.locator(":checked")).waitFor();
  };

  private setSwitch = async (label: string, on: boolean): Promise<void> => {
    const control = this.locators.field(label, "switch");
    if ((await control.getAttribute("aria-checked")) === String(on)) return;
    await control.click();
    await this.page
      .locator(`[role="switch"][aria-checked="${String(on)}"]`)
      .and(control)
      .waitFor();
  };

  private fillOneTimeTrial = async (trial: OneTimeTrialData): Promise<void> => {
    await this.setSwitch("Enable trial without a card?", true);
    await this.locators
      .field("Length of the trial in days", "spinbutton")
      .fill(String(trial.lengthInDays));
  };

  private fillSubscriptionTrial = async (trial: SubscriptionTrialData): Promise<void> => {
    await this.setSwitch("Trial Subscription ?", true);
    await this.setSwitch("Without card ?", trial.withoutCard);
    await this.locators
      .field("Length of the trial in days", "spinbutton")
      .fill(String(trial.lengthInDays));
  };

  /* Ticks or clears "Use advance installment options" to match the data (the checkbox can start ticked). */
  private fillAdvanced = async (advanced: AdvancedInstallmentData | undefined): Promise<void> => {
    const checkbox = this.locators.advancedInstallmentsCheckbox();
    if ((await checkbox.isChecked()) !== (advanced !== undefined))
      await this.locators.checkboxText("Use advance installment options").click();
    if (advanced === undefined) return;
    await this.locators.initialCycleAmount().fill(String(advanced.initialCycleAmount));
    await this.locators.initialCycleLength().fill(String(advanced.initialCycleLength));
  };

  /*
   * A new tiered price starts with two rows (units 1 to 1 and 2 to infinity). Each extra tier is a new
   * row added before the last one. Row 1 has a fixed last unit and the last row has none, so a last
   * unit is typed only into the rows in between.
   */
  private fillTiers = async (tiers: Array<TierData>): Promise<void> => {
    for (let added = 2; added < tiers.length; added++) {
      await this.locators.addTierButton().click();
      await this.locators.tierRows().nth(added).waitFor();
    }
    for (const [index, tier] of tiers.entries()) {
      const row = this.locators.tierRows().nth(index);
      await row.getByRole("spinbutton").last().fill(String(tier.pricePerUnit));
      if (tier.lastUnit !== undefined)
        await row.getByRole("spinbutton").first().fill(String(tier.lastUnit));
    }
  };

  private fillDontMultiply = async (afterQuantity: number | undefined): Promise<void> => {
    if (afterQuantity === undefined) return;
    await this.locators.checkboxText("Don't multiply price and unit after x quantity").click();
    await this.locators.dontMultiplyCheckbox().and(this.page.locator(":checked")).waitFor();
    await this.locators.dontMultiplyThreshold().fill(String(afterQuantity));
  };

  /* A flat price starts with one row (Unit and Price). Every extra tier adds a row at the end. */
  private fillFlatTiers = async (tiers: Array<FlatTierData>): Promise<void> => {
    for (let added = 1; added < tiers.length; added++) {
      await this.locators.addTierButton().click();
      await this.locators.tierRows().nth(added).waitFor();
    }
    for (const [index, tier] of tiers.entries()) {
      const row = this.locators.tierRows().nth(index);
      await row.getByRole("spinbutton").first().fill(String(tier.unit));
      await row.getByRole("spinbutton").last().fill(String(tier.price));
    }
  };

  private fillDonationAmounts = async (
    preset: number,
    minimum: number | undefined,
    maximum: number | undefined,
  ): Promise<void> => {
    await this.locators.donationPresetAmount().fill(String(preset));
    if (minimum !== undefined) await this.locators.donationMinimumAmount().fill(String(minimum));
    if (maximum !== undefined) await this.locators.donationMaximumAmount().fill(String(maximum));
  };

  private fillDonationText = async (text: string | undefined): Promise<void> => {
    if (text === undefined) return;
    await this.locators.donationTextEditor().fill(text);
  };
}
