import { faker } from "@faker-js/faker";

import {
  ALL_PRICING_PLANS,
  getPlanSettings,
  supportsPlan,
} from "@/helpers/data/pricing/pricing.matrix";
import type {
  DonationOneTimePriceData,
  DonationRecurringPriceData,
  OneTimeFlatPriceData,
  OneTimeStandardPriceData,
  OneTimeTieredPriceData,
  PriceData,
  PricingPlanType,
  PricingProductType,
  SplitPaymentPriceData,
  SubscriptionFlatPriceData,
  SubscriptionStandardPriceData,
  SubscriptionTieredPriceData,
} from "@/helpers/data/pricing/pricing.types";

/*
 * Default values per plan. Every builder returns the plan's REQUIRED fields only, so the data is valid
 * for every product that supports the plan. Settings that exist for some products only (trial,
 * expiry) are added by buildPrice() or by the test through overrides.
 */
const randomAmount = (): number =>
  faker.number.int({
    min: 5,
    max: 500,
  });

export const buildOneTimeStandardPrice = (
  overrides: Partial<OneTimeStandardPriceData> = {},
): OneTimeStandardPriceData => ({
  plan: "one-time-standard",
  price: randomAmount(),
  ...overrides,
});

export const buildSplitPaymentPrice = (
  overrides: Partial<SplitPaymentPriceData> = {},
): SplitPaymentPriceData => ({
  plan: "split-payment",
  installmentAmount: randomAmount(),
  billingPeriod: "Monthly",
  totalInstallments: faker.number.int({
    min: 2,
    max: 6,
  }),
  expiry: {
    kind: "lifetime",
  },
  ...overrides,
});

export const buildSubscriptionStandardPrice = (
  overrides: Partial<SubscriptionStandardPriceData> = {},
): SubscriptionStandardPriceData => ({
  plan: "subscription-standard",
  price: randomAmount(),
  billingPeriod: "Monthly",
  ...overrides,
});

/* The two fixed tiers of a new tiered price: units 1 to 1, then 2 to infinity. */
const defaultTiers = (): OneTimeTieredPriceData["tiers"] => [
  {
    pricePerUnit: randomAmount(),
  },
  {
    pricePerUnit: randomAmount(),
  },
];

export const buildOneTimeTieredPrice = (
  overrides: Partial<OneTimeTieredPriceData> = {},
): OneTimeTieredPriceData => ({
  plan: "one-time-tiered",
  tiers: defaultTiers(),
  ...overrides,
});

export const buildSubscriptionTieredPrice = (
  overrides: Partial<SubscriptionTieredPriceData> = {},
): SubscriptionTieredPriceData => ({
  plan: "subscription-tiered",
  tiers: defaultTiers(),
  billingPeriod: "Monthly",
  ...overrides,
});

export const buildOneTimeFlatPrice = (
  overrides: Partial<OneTimeFlatPriceData> = {},
): OneTimeFlatPriceData => ({
  plan: "one-time-flat",
  tiers: [
    {
      unit: 1,
      price: randomAmount(),
    },
  ],
  ...overrides,
});

export const buildSubscriptionFlatPrice = (
  overrides: Partial<SubscriptionFlatPriceData> = {},
): SubscriptionFlatPriceData => ({
  plan: "subscription-flat",
  tiers: [
    {
      unit: 1,
      price: randomAmount(),
    },
  ],
  billingPeriod: "Monthly",
  ...overrides,
});

export const buildDonationOneTimePrice = (
  overrides: Partial<DonationOneTimePriceData> = {},
): DonationOneTimePriceData => ({
  plan: "donation-one-time",
  presetAmount: randomAmount(),
  expiry: {
    kind: "lifetime",
  },
  ...overrides,
});

export const buildDonationRecurringPrice = (
  overrides: Partial<DonationRecurringPriceData> = {},
): DonationRecurringPriceData => ({
  plan: "donation-recurring",
  presetAmount: randomAmount(),
  billingPeriod: "Monthly",
  ...overrides,
});

/*
 * Builds a valid price of `plan` for `product`: the plan's required fields plus the expiry the product
 * asks for (a one-time price on a course or membership shows Lifetime / Limited and requires a choice).
 * It throws when the product does not support the plan, so a spec cannot silently test the impossible.
 */
export const buildPrice = (product: PricingProductType, plan: PricingPlanType): PriceData => {
  if (!supportsPlan(product, plan))
    throw new Error(`The ${product} pricing page does not offer the ${plan} plan.`);
  const needsExpiry = getPlanSettings(product, plan).includes("expiry");
  const expiry = needsExpiry
    ? {
        kind: "lifetime" as const,
      }
    : undefined;
  switch (plan) {
    case "one-time-standard":
      return buildOneTimeStandardPrice({
        expiry,
      });
    case "split-payment":
      return buildSplitPaymentPrice();
    case "subscription-standard":
      return buildSubscriptionStandardPrice();
    case "one-time-tiered":
      return buildOneTimeTieredPrice({
        expiry,
      });
    case "subscription-tiered":
      return buildSubscriptionTieredPrice();
    case "one-time-flat":
      return buildOneTimeFlatPrice();
    case "subscription-flat":
      return buildSubscriptionFlatPrice();
    case "donation-one-time":
      return buildDonationOneTimePrice();
    case "donation-recurring":
      return buildDonationRecurringPrice();
  }
};

/* One valid price for each plan the product supports (the "everything the product can sell" set). */
export const buildAllPrices = (product: PricingProductType): Array<PriceData> =>
  ALL_PRICING_PLANS.filter((plan) => supportsPlan(product, plan)).map((plan) =>
    buildPrice(product, plan),
  );
