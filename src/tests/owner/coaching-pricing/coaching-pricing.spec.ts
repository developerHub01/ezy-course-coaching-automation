import { expect, test } from "@/fixtures";
import {
  buildAllPrices,
  buildDonationOneTimePrice,
  buildDonationRecurringPrice,
  buildOneTimeStandardPrice,
  buildSplitPaymentPrice,
  buildSubscriptionStandardPrice,
} from "@/helpers/data/pricing/pricing.factory";
import { ALL_BILLING_PERIODS, PRODUCT_PRICING } from "@/helpers/data/pricing/pricing.matrix";
import type { BillingPeriod } from "@/helpers/data/pricing/pricing.types";
import { PricingMessage, PricingValidation } from "@/helpers/pricing-messages";
import { Tag } from "@/helpers/tags";

/*
 * Test cases: src/tests/owner/coaching-pricing/test-cases/coaching-pricing.md
 * Each test makes its own coaching program and opens its Pricing screen with the newProgramPricing
 * fixture (the program is only the starting point; createProgram deletes it afterwards, even after a
 * failure). The rules about which plans a coaching program offers and which can repeat are read from
 * the pricing matrix (docs/product/pricing.md). Currency is never asserted: it changes between runs.
 */
const coachingPlans = PRODUCT_PRICING.coaching.supportedPlans;

/* The word a subscription card prints for each billing period (for example "$25/month"). */
const PERIOD_WORD: Record<BillingPeriod, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
  Yearly: "year",
  "Every 3 months": "3 months",
  "Every 6 months": "6 months",
};

const common = [Tag.Regression, Tag.Owner, Tag.Coaching, Tag.CoachingPricing, Tag.Pricing];

test.describe("Coaching pricing", () => {
  test.describe("Functional", () => {
    /* TC-COACH-401 */
    test(
      "TC-COACH-401: Owner adds a one-time standard price",
      {
        tag: [...common, Tag.Smoke, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();
        const price = buildOneTimeStandardPrice();

        const priceId = await pricing.addPrice(price);

        await expect(pricing.card(priceId)).toContainText(String(price.price));
        await expect(pricing.card(priceId)).toContainText("One Time");
        await expect(pricing.card(priceId)).toContainText("Default");
      },
    );

    /* TC-COACH-402 */
    test(
      "TC-COACH-402: A one-time price with a strike-through price shows both amounts",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildOneTimeStandardPrice({
            strikeThroughPrice: 80,
            price: 50,
          }),
        );

        await expect(pricing.card(priceId)).toContainText("80");
        await expect(pricing.card(priceId)).toContainText("50");
        await expect(pricing.card(priceId)).toContainText("One Time");
      },
    );

    /* TC-COACH-403 */
    test(
      "TC-COACH-403: Owner adds a split payment with lifetime access",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildSplitPaymentPrice({
            installmentAmount: 30,
            billingPeriod: "Monthly",
            totalInstallments: 3,
            expiry: {
              kind: "lifetime",
            },
          }),
        );

        await expect(pricing.card(priceId)).toContainText("30");
        await expect(pricing.card(priceId)).toContainText("month");
        await expect(pricing.card(priceId)).toContainText("3 installments");
      },
    );

    /* TC-COACH-404 */
    test(
      "TC-COACH-404: A split payment with limited access is saved",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildSplitPaymentPrice({
            installmentAmount: 20,
            billingPeriod: "Weekly",
            totalInstallments: 4,
            expiry: {
              kind: "limited",
              days: 90,
            },
          }),
        );

        await expect(pricing.card(priceId)).toContainText("20");
        await expect(pricing.card(priceId)).toContainText("week");
        await expect(pricing.card(priceId)).toContainText("4 installments");
      },
    );

    /* TC-COACH-405 */
    test(
      "TC-COACH-405: A split payment with advanced installments and a strike-through price is saved",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildSplitPaymentPrice({
            strikeThroughPrice: 99,
            installmentAmount: 40,
            billingPeriod: "Monthly",
            totalInstallments: 4,
            advanced: {
              initialCycleAmount: 11,
              initialCycleLength: 2,
            },
          }),
        );

        await expect(pricing.card(priceId)).toContainText("99");
        await expect(pricing.card(priceId)).toContainText("for first 2 installments and then");
      },
    );

    /* TC-COACH-406 */
    test(
      "TC-COACH-406: Owner adds a subscription",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildSubscriptionStandardPrice({
            price: 25,
            billingPeriod: "Monthly",
          }),
        );

        await expect(pricing.card(priceId)).toContainText("25");
        await expect(pricing.card(priceId)).toContainText("/month");
        await expect(pricing.card(priceId)).toContainText("Subscription");
      },
    );

    /* TC-COACH-407 */
    test(
      "TC-COACH-407: A subscription with a strike-through price shows both amounts",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildSubscriptionStandardPrice({
            strikeThroughPrice: 80,
            price: 40,
            billingPeriod: "Yearly",
          }),
        );

        await expect(pricing.card(priceId)).toContainText("80");
        await expect(pricing.card(priceId)).toContainText("40");
        await expect(pricing.card(priceId)).toContainText("year");
      },
    );

    /* TC-COACH-408 */
    test(
      "TC-COACH-408: A subscription with advanced installments is saved",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildSubscriptionStandardPrice({
            price: 50,
            billingPeriod: "Monthly",
            advanced: {
              initialCycleAmount: 5,
              initialCycleLength: 1,
            },
          }),
        );

        await expect(pricing.card(priceId)).toContainText("first month");
        await expect(pricing.card(priceId)).toContainText("/month");
      },
    );

    /* TC-COACH-409 */
    test(
      "TC-COACH-409: A subscription accepts every billing period",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        for (const period of ALL_BILLING_PERIODS) {
          const priceId = await pricing.addPrice(
            buildSubscriptionStandardPrice({
              billingPeriod: period,
            }),
          );
          await expect(pricing.card(priceId)).toContainText(PERIOD_WORD[period]);
        }

        expect(await pricing.priceCount()).toBe(ALL_BILLING_PERIODS.length);
      },
    );

    /* TC-COACH-410 */
    test(
      "TC-COACH-410: A split payment accepts every billing period",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        for (const period of ALL_BILLING_PERIODS)
          await pricing.addPrice(
            buildSplitPaymentPrice({
              billingPeriod: period,
            }),
          );

        expect(await pricing.priceCount()).toBe(ALL_BILLING_PERIODS.length);
      },
    );

    /* TC-COACH-411 */
    test(
      "TC-COACH-411: Owner adds a one-time donation",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildDonationOneTimePrice({
            presetAmount: 15,
          }),
        );

        await expect(pricing.card(priceId)).toContainText("Donation");
        await expect(pricing.card(priceId)).toContainText("Default Price");
        await expect(pricing.card(priceId)).toContainText("15");
      },
    );

    /* TC-COACH-412 */
    test(
      "TC-COACH-412: A one-time donation with limits, text and limited access is saved",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildDonationOneTimePrice({
            presetAmount: 20,
            minimumAmount: 5,
            maximumAmount: 100,
            text: "Thank you",
            expiry: {
              kind: "limited",
              days: 30,
            },
          }),
        );

        await expect(pricing.card(priceId)).toContainText(/Minimum Donation\s*\D*5(?!\d)/);
        await expect(pricing.card(priceId)).toContainText(/Maximum Donation\s*\D*100(?!\d)/);
      },
    );

    /* TC-COACH-413 */
    test(
      "TC-COACH-413: Owner adds a recurring donation",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildDonationRecurringPrice({
            presetAmount: 10,
            billingPeriod: "Monthly",
          }),
        );

        await expect(pricing.card(priceId)).toContainText("Donation");
        await expect(pricing.card(priceId)).toContainText("10");
        await expect(pricing.card(priceId)).toContainText("/month");
      },
    );

    /* TC-COACH-414 */
    test(
      "TC-COACH-414: A recurring donation with limits and text is saved",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(
          buildDonationRecurringPrice({
            presetAmount: 10,
            minimumAmount: 2,
            maximumAmount: 50,
            billingPeriod: "Yearly",
            text: "Thanks",
          }),
        );

        await expect(pricing.card(priceId)).toContainText("/year");
        await expect(pricing.card(priceId)).toContainText(/Minimum Donation\s*\D*2(?!\d)/);
        await expect(pricing.card(priceId)).toContainText(/Maximum Donation\s*\D*50(?!\d)/);
      },
    );

    /* TC-COACH-415 */
    test(
      "TC-COACH-415: A price of zero is accepted (intended)",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(
          buildOneTimeStandardPrice({
            price: 0,
          }),
        );

        expect(await pricing.priceCount()).toBe(1);
      },
    );

    /* TC-COACH-416 */
    test(
      "TC-COACH-416: A strike-through price lower than the price is accepted (intended)",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(
          buildOneTimeStandardPrice({
            strikeThroughPrice: 5,
            price: 10,
          }),
        );

        expect(await pricing.priceCount()).toBe(1);
      },
    );

    /* TC-COACH-417 */
    test(
      "TC-COACH-417: One price of every plan fits on one program",
      {
        tag: [...common, Tag.Positive, Tag.PricingPlanLimit],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();
        const prices = buildAllPrices("coaching");

        for (const price of prices) await pricing.addPrice(price);

        expect(await pricing.priceCount()).toBe(prices.length);
        expect(await pricing.offeredPlans()).toEqual(["split-payment", "subscription-standard"]);
      },
    );

    /* TC-COACH-418 */
    test(
      "TC-COACH-418: Split and subscription prices can each be added twice",
      {
        tag: [...common, Tag.Positive, Tag.PricingPlanLimit],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(buildSplitPaymentPrice());
        await pricing.addPrice(buildSplitPaymentPrice());
        await pricing.addPrice(buildSubscriptionStandardPrice());
        await pricing.addPrice(buildSubscriptionStandardPrice());

        expect(await pricing.priceCount()).toBe(4);
        const offered = await pricing.offeredPlans();
        expect(offered).toContain("split-payment");
        expect(offered).toContain("subscription-standard");
      },
    );

    /* TC-COACH-419 */
    test(
      "TC-COACH-419: A one-time standard plan is no longer offered after one price is added",
      {
        tag: [...common, Tag.Negative, Tag.PricingPlanLimit],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(buildOneTimeStandardPrice());
        const offered = await pricing.offeredPlans();

        expect(offered).not.toContain("one-time-standard");
        expect(offered).toEqual(coachingPlans.filter((plan) => plan !== "one-time-standard"));
      },
    );

    /* TC-COACH-420 */
    test(
      "TC-COACH-420: Both donation plans are no longer offered after one price each",
      {
        tag: [...common, Tag.Negative, Tag.PricingPlanLimit],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(buildDonationOneTimePrice());
        await pricing.addPrice(buildDonationRecurringPrice());
        const offered = await pricing.offeredPlans();

        expect(offered).not.toContain("donation-one-time");
        expect(offered).not.toContain("donation-recurring");
        expect(offered).toEqual(["one-time-standard", "split-payment", "subscription-standard"]);
      },
    );

    /* TC-COACH-421 */
    test(
      "TC-COACH-421: Archiving a price makes its plan available again",
      {
        tag: [...common, Tag.Positive, Tag.PricingPlanLimit],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        /* The first price is the default and a default price cannot be archived, so it goes first. */
        await pricing.addPrice(buildOneTimeStandardPrice());
        const donationId = await pricing.addPrice(buildDonationOneTimePrice());
        expect(await pricing.offeredPlans()).not.toContain("donation-one-time");
        await pricing.cancelForm();
        await pricing.archivePrice(donationId);

        await expect(pricing.card(donationId)).toHaveCount(0);
        expect(await pricing.offeredPlans()).toContain("donation-one-time");
      },
    );

    /* TC-COACH-440 */
    test(
      "TC-COACH-440: The first price is the default and a later one is not",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const firstId = await pricing.addPrice(buildOneTimeStandardPrice());
        const secondId = await pricing.addPrice(buildSplitPaymentPrice());

        await expect(pricing.card(firstId)).toContainText("Default");
        await expect(pricing.card(secondId)).not.toContainText("Default");
      },
    );

    /* TC-COACH-441 */
    test(
      "TC-COACH-441: Owner sets another price as default",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing, toast }) => {
        const pricing = await newProgramPricing();

        const firstId = await pricing.addPrice(buildOneTimeStandardPrice());
        const secondId = await pricing.addPrice(buildSplitPaymentPrice());
        await pricing.setAsDefault(secondId);

        await expect(toast.message(PricingMessage.markedDefault)).toBeVisible();
        await expect(pricing.card(secondId)).toContainText("Default");
        await expect(pricing.card(firstId)).not.toContainText("Default");
      },
    );

    /* TC-COACH-442 */
    test(
      "TC-COACH-442: Owner makes a price private and public again",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(buildOneTimeStandardPrice());
        const splitId = await pricing.addPrice(buildSplitPaymentPrice());
        await pricing.makePrivate(splitId);
        await expect(pricing.card(splitId)).toContainText("Private");
        await pricing.makePublic(splitId);

        await expect(pricing.card(splitId)).not.toContainText("Private");
      },
    );

    /* TC-COACH-443 */
    test(
      "TC-COACH-443: A private price cannot be set as default",
      {
        tag: [...common, Tag.Negative],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.addPrice(buildOneTimeStandardPrice());
        const splitId = await pricing.addPrice(buildSplitPaymentPrice());
        await pricing.makePrivate(splitId);
        await pricing.openMenu(splitId);

        await expect(pricing.menuButton("Set as default")).toBeDisabled();
      },
    );

    /* TC-COACH-444 */
    test(
      "TC-COACH-444: The default price cannot be archived or made private",
      {
        tag: [...common, Tag.Negative],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(buildOneTimeStandardPrice());
        await pricing.openMenu(priceId);

        await expect(pricing.menuButton("Make it private")).toBeDisabled();
        await expect(pricing.menuButton("Archive")).toBeDisabled();
      },
    );

    /* TC-COACH-445 */
    test(
      "TC-COACH-445: Updating a price replaces it with the new amount",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const oldId = await pricing.addPrice(
          buildSubscriptionStandardPrice({
            price: 40,
          }),
        );
        const newId = await pricing.updatePrice(
          oldId,
          buildSubscriptionStandardPrice({
            price: 77,
          }),
        );

        expect(newId).not.toBe(oldId);
        await expect(pricing.card(newId)).toContainText("77");
        await expect(pricing.card(oldId)).toHaveCount(0);
        expect(await pricing.priceCount()).toBe(1);
      },
    );

    /* TC-COACH-446 */
    test(
      "TC-COACH-446: Cancelling a delete keeps the price",
      {
        tag: [...common, Tag.Negative],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(buildOneTimeStandardPrice());
        await pricing.cancelDeleting(priceId);

        await expect(pricing.card(priceId)).toBeVisible();
        expect(await pricing.priceCount()).toBe(1);
      },
    );

    /* TC-COACH-447 */
    test(
      "TC-COACH-447: Owner deletes a price",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing, toast }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(buildOneTimeStandardPrice());
        await pricing.deletePrice(priceId);

        await expect(toast.message(PricingMessage.deleted)).toBeVisible();
        await expect(pricing.card(priceId)).toHaveCount(0);
        expect(await pricing.offeredPlans()).toContain("one-time-standard");
      },
    );

    /* TC-COACH-448 */
    test(
      "TC-COACH-448: Copying the payment link confirms with a message",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing, toast }) => {
        const pricing = await newProgramPricing();

        const priceId = await pricing.addPrice(buildOneTimeStandardPrice());
        await pricing.copyPaymentUrl(priceId);

        await expect(toast.message(PricingMessage.linkCopied)).toBeVisible();
      },
    );
  });

  test.describe("UI", () => {
    /* TC-COACH-430 */
    test(
      "TC-COACH-430: A new program offers the five coaching plans",
      {
        tag: [...common, Tag.Positive],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        expect(await pricing.offeredPlans()).toEqual([...coachingPlans]);
      },
    );
  });

  test.describe("Validation", () => {
    /* TC-COACH-450 */
    test(
      "TC-COACH-450: An empty one-time standard form asks for the price",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.openAddForm();
        const outcome = await pricing.attemptCreate();

        expect(outcome).toBe("rejected");
        await expect(pricing.fieldMessage(PricingValidation.priceRequired)).toBeVisible();
        await pricing.cancelForm();
        expect(await pricing.priceCount()).toBe(0);
      },
    );

    /* TC-COACH-451 */
    test(
      "TC-COACH-451: An empty subscription form asks for the billing period",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.openAddForm();
        await pricing.choosePlan("subscription-standard");
        const outcome = await pricing.attemptCreate();

        expect(outcome).toBe("rejected");
        await expect(pricing.fieldMessage(PricingValidation.billingPeriodRequired)).toBeVisible();
        await pricing.cancelForm();
        expect(await pricing.priceCount()).toBe(0);
      },
    );

    /* TC-COACH-452 */
    test(
      "TC-COACH-452: An empty split payment form is refused",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.openAddForm();
        await pricing.choosePlan("split-payment");
        const outcome = await pricing.attemptCreate();

        expect(outcome).toBe("rejected");
        await expect(
          pricing.fieldMessage(PricingValidation.billingPeriodRequired).first(),
        ).toBeVisible();
        await pricing.cancelForm();
        expect(await pricing.priceCount()).toBe(0);
      },
    );

    /* TC-COACH-453 */
    test(
      "TC-COACH-453: An empty one-time donation form asks for the access length",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.openAddForm();
        await pricing.choosePlan("donation-one-time");
        const outcome = await pricing.attemptCreate();

        expect(outcome).toBe("rejected");
        await expect(pricing.fieldMessage(PricingValidation.expiryRequired)).toBeVisible();
        await pricing.cancelForm();
        expect(await pricing.priceCount()).toBe(0);
      },
    );

    /* TC-COACH-454 */
    test(
      "TC-COACH-454: An empty recurring donation form asks for the billing period",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        await pricing.openAddForm();
        await pricing.choosePlan("donation-recurring");
        const outcome = await pricing.attemptCreate();

        expect(outcome).toBe("rejected");
        await expect(pricing.fieldMessage(PricingValidation.billingPeriodRequired)).toBeVisible();
        await pricing.cancelForm();
        expect(await pricing.priceCount()).toBe(0);
      },
    );

    /* TC-COACH-455 */
    test(
      "TC-COACH-455: A split payment with one installment is refused",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const outcome = await pricing.attemptAddPrice(
          buildSplitPaymentPrice({
            installmentAmount: 10,
            totalInstallments: 1,
          }),
        );

        expect(outcome).toBe("rejected");
      },
    );

    /* TC-COACH-456 */
    test(
      "TC-COACH-456: A maximum donation lower than the minimum is refused",
      {
        tag: [...common, Tag.Negative, Tag.PricingValidation],
      },
      async ({ newProgramPricing }) => {
        const pricing = await newProgramPricing();

        const outcome = await pricing.attemptAddPrice(
          buildDonationOneTimePrice({
            presetAmount: 50,
            minimumAmount: 100,
            maximumAmount: 20,
          }),
        );

        expect(outcome).toBe("rejected");
      },
    );
  });
});
