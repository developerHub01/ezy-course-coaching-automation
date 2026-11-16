/*
 * Shapes of the pricing data used by every product. The rules about which product may use which
 * plan, and which setting a plan shows for which product, are in pricing.matrix.ts and are written
 * up in docs/product/pricing.md.
 */

export type PricingPlanType =
  | "one-time-standard"
  | "split-payment"
  | "subscription-standard"
  | "one-time-tiered"
  | "subscription-tiered"
  | "one-time-flat"
  | "subscription-flat"
  | "donation-one-time"
  | "donation-recurring";

export type PricingProductType =
  | "course"
  | "membership"
  | "coaching"
  | "community"
  | "appointment"
  | "digital-product"
  | "physical-product"
  | "video-library"
  | "audio-library"
  | "event"
  | "group-chat"
  | "private-chat";

/* Options of the Billing period select. "Custom" is left out until its extra fields are explored. */
export type BillingPeriod =
  "Daily" | "Weekly" | "Monthly" | "Yearly" | "Every 3 months" | "Every 6 months";

/* Every setting a price form can show. Used by the matrix to say which plan shows which setting. */
export type PricingSetting =
  | "strikeThroughPrice"
  | "price"
  | "installmentAmount"
  | "totalInstallments"
  | "billingPeriod"
  | "advancedInstallments"
  | "trial"
  | "expiry"
  | "tiers"
  | "dontMultiplyAfter"
  | "flatTiers"
  | "presetAmount"
  | "donationLimits"
  | "donationText";

export interface LifetimeExpiryData {
  kind: "lifetime";
}

/* "Limited": the access ends after this many days (after enrollment for split and donation plans). */
export interface LimitedExpiryData {
  kind: "limited";
  days: number;
}

export type ExpiryData = LifetimeExpiryData | LimitedExpiryData;

/* Trial of a one-time standard price ("Enable trial without a card?"). */
export interface OneTimeTrialData {
  lengthInDays: number;
}

/* Trial of a subscription price ("Trial Subscription" plus the "Without card" switch). */
export interface SubscriptionTrialData {
  lengthInDays: number;
  withoutCard: boolean;
}

/* The "Use advance installment options" block of split and standard subscription prices. */
export interface AdvancedInstallmentData {
  initialCycleAmount: number;
  initialCycleLength: number;
}

/*
 * One row of a tiered price. The first row is fixed (units 1 to 1) and the last row always runs to
 * infinity, so only the rows in between carry a lastUnit.
 */
export interface TierData {
  lastUnit?: number;
  pricePerUnit: number;
}

/* One row of a flat price table (Unit and Price). */
export interface FlatTierData {
  unit: number;
  price: number;
}

export interface OneTimeStandardPriceData {
  plan: "one-time-standard";
  strikeThroughPrice?: number;
  price: number;
  expiry?: ExpiryData;
  trial?: OneTimeTrialData;
}

export interface SplitPaymentPriceData {
  plan: "split-payment";
  strikeThroughPrice?: number;
  installmentAmount: number;
  billingPeriod: BillingPeriod;
  totalInstallments: number;
  advanced?: AdvancedInstallmentData;
  expiry?: ExpiryData;
}

export interface SubscriptionStandardPriceData {
  plan: "subscription-standard";
  strikeThroughPrice?: number;
  price: number;
  billingPeriod: BillingPeriod;
  trial?: SubscriptionTrialData;
  advanced?: AdvancedInstallmentData;
}

export interface OneTimeTieredPriceData {
  plan: "one-time-tiered";
  tiers: Array<TierData>;
  dontMultiplyAfter?: number;
  expiry?: ExpiryData;
}

export interface SubscriptionTieredPriceData {
  plan: "subscription-tiered";
  tiers: Array<TierData>;
  dontMultiplyAfter?: number;
  billingPeriod: BillingPeriod;
  trial?: SubscriptionTrialData;
}

export interface OneTimeFlatPriceData {
  plan: "one-time-flat";
  tiers: Array<FlatTierData>;
}

export interface SubscriptionFlatPriceData {
  plan: "subscription-flat";
  tiers: Array<FlatTierData>;
  billingPeriod: BillingPeriod;
  trial?: SubscriptionTrialData;
}

export interface DonationOneTimePriceData {
  plan: "donation-one-time";
  presetAmount: number;
  minimumAmount?: number;
  maximumAmount?: number;
  text?: string;
  expiry?: ExpiryData;
}

export interface DonationRecurringPriceData {
  plan: "donation-recurring";
  presetAmount: number;
  minimumAmount?: number;
  maximumAmount?: number;
  billingPeriod: BillingPeriod;
  text?: string;
}

/* Discriminated by `plan`: narrowing on it gives exactly the fields that plan has. */
export type PriceData =
  | OneTimeStandardPriceData
  | SplitPaymentPriceData
  | SubscriptionStandardPriceData
  | OneTimeTieredPriceData
  | SubscriptionTieredPriceData
  | OneTimeFlatPriceData
  | SubscriptionFlatPriceData
  | DonationOneTimePriceData
  | DonationRecurringPriceData;
