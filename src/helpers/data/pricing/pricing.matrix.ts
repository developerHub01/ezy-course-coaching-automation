import type {
  BillingPeriod,
  PricingPlanType,
  PricingProductType,
  PricingSetting,
} from "@/helpers/data/pricing/pricing.types";

/*
 * The pricing matrix, observed live on the demo1 tenant (2026-11-16) and written up in
 * docs/product/pricing.md. Specs and factories read the rules from here, so a test never hardcodes
 * "this product has no split payment".
 */

/* Text of each plan in the plan list on the left of the price form. */
export const PRICING_PLAN_LABEL: Record<PricingPlanType, string> = {
  "one-time-standard": "One-time Plan(Standard)",
  "split-payment": "Split Payment Plan",
  "subscription-standard": "Subscription Plan(Standard)",
  "one-time-tiered": "One-time Plan(Tiered)",
  "subscription-tiered": "Subscription Plan(Tiered)",
  "one-time-flat": "One-time Plan - Flat Price (Tiered)",
  "subscription-flat": "Subscription Plan - Flat Price(Tiered)",
  "donation-one-time": "Donation Plan (One Time)",
  "donation-recurring": "Donation Plan (Recurring)",
};

/* The heading above the form once a plan is chosen. Tiered and flat one-time plans share one heading. */
export const PRICING_PLAN_FORM_HEADING: Record<PricingPlanType, string> = {
  "one-time-standard": "One-time Plan (Standard)",
  "split-payment": "Split Payment Plan",
  "subscription-standard": "Subscription Plan (Standard)",
  "one-time-tiered": "One-time Plan (Tiered)",
  "subscription-tiered": "Subscription Plan (Tiered)",
  "one-time-flat": "One-time Plan (Tiered)",
  "subscription-flat": "Subscription Plan (Tiered)",
  "donation-one-time": "Donation Plan (One Time)",
  "donation-recurring": "Donation Plan (Recurring)",
};

export const ALL_PRICING_PLANS: ReadonlyArray<PricingPlanType> = [
  "one-time-standard",
  "split-payment",
  "subscription-standard",
  "one-time-tiered",
  "subscription-tiered",
  "one-time-flat",
  "subscription-flat",
  "donation-one-time",
  "donation-recurring",
];

export const ALL_BILLING_PERIODS: ReadonlyArray<BillingPeriod> = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
  "Every 3 months",
  "Every 6 months",
];

/*
 * How many ACTIVE prices of one plan a product accepts. Once the limit is reached the plan
 * disappears from the plan list (verified on course, group and video library). Deleting or archiving
 * a price frees its slot again. Split and subscription plans can be added as often as wanted.
 */
export const PRICING_PLAN_MAX_ACTIVE: Record<PricingPlanType, number> = {
  "one-time-standard": 1,
  "split-payment": Number.POSITIVE_INFINITY,
  "subscription-standard": Number.POSITIVE_INFINITY,
  "one-time-tiered": 1,
  "subscription-tiered": Number.POSITIVE_INFINITY,
  "one-time-flat": 1,
  "subscription-flat": Number.POSITIVE_INFINITY,
  "donation-one-time": 1,
  "donation-recurring": 1,
};

/* The settings a plan shows by default. Product differences are removed in getPlanSettings(). */
const BASE_PLAN_SETTINGS: Record<PricingPlanType, ReadonlyArray<PricingSetting>> = {
  "one-time-standard": ["strikeThroughPrice", "price", "expiry", "trial"],
  "split-payment": [
    "strikeThroughPrice",
    "installmentAmount",
    "billingPeriod",
    "advancedInstallments",
    "totalInstallments",
    "expiry",
  ],
  "subscription-standard": [
    "strikeThroughPrice",
    "price",
    "billingPeriod",
    "trial",
    "advancedInstallments",
  ],
  "one-time-tiered": ["tiers", "dontMultiplyAfter", "expiry"],
  "subscription-tiered": ["tiers", "dontMultiplyAfter", "billingPeriod", "trial"],
  "one-time-flat": ["flatTiers"],
  "subscription-flat": ["flatTiers", "billingPeriod", "trial"],
  "donation-one-time": ["presetAmount", "donationLimits", "donationText", "expiry"],
  "donation-recurring": ["presetAmount", "donationLimits", "billingPeriod", "donationText"],
};

export interface ProductPricingInfo {
  label: string;
  /* Path of the product's pricing page. The id is the product's own id from its list. */
  pricingPath: (productId: number | string) => string;
  supportedPlans: ReadonlyArray<PricingPlanType>;
  /* False when the product has NOT been checked on its own pricing page yet. */
  verified: boolean;
}

/* The five plans every ordinary product shows. */
const CORE_PLANS: ReadonlyArray<PricingPlanType> = [
  "one-time-standard",
  "split-payment",
  "subscription-standard",
  "donation-one-time",
  "donation-recurring",
];

export const PRODUCT_PRICING: Record<PricingProductType, ProductPricingInfo> = {
  course: {
    label: "Course",
    pricingPath: (productId) => `/dashboard/courses/${productId}/pricing/`,
    supportedPlans: ALL_PRICING_PLANS,
    verified: true,
  },
  membership: {
    label: "Membership",
    pricingPath: (productId) => `/dashboard/membership/${productId}/product-price/`,
    supportedPlans: ALL_PRICING_PLANS,
    verified: true,
  },
  coaching: {
    label: "Coaching program",
    pricingPath: (productId) => `/dashboard/coaching-program/${productId}/product-price/`,
    supportedPlans: CORE_PLANS,
    verified: true,
  },
  community: {
    label: "Community",
    pricingPath: (productId) => `/dashboard/community/${productId}/product-price/`,
    supportedPlans: CORE_PLANS,
    verified: true,
  },
  appointment: {
    label: "Appointment",
    pricingPath: (productId) => `/dashboard/appointment-event/${productId}/product-price/`,
    supportedPlans: ["one-time-standard"],
    verified: true,
  },
  "digital-product": {
    label: "Digital product",
    pricingPath: (productId) => `/dashboard/digital-product/${productId}/product-price/`,
    supportedPlans: ["one-time-standard"],
    verified: true,
  },
  /* The physical product reuses the digital-product path (confirmed on a physical product). */
  "physical-product": {
    label: "Physical product",
    pricingPath: (productId) => `/dashboard/digital-product/${productId}/product-price/`,
    supportedPlans: ["one-time-standard"],
    verified: true,
  },
  "video-library": {
    label: "Video library",
    pricingPath: (productId) => `/dashboard/video-library/${productId}/product-price/`,
    supportedPlans: CORE_PLANS,
    verified: true,
  },
  /* The audio library shares the video-library pricing path. */
  "audio-library": {
    label: "Audio library",
    pricingPath: (productId) => `/dashboard/video-library/${productId}/product-price/`,
    supportedPlans: CORE_PLANS,
    verified: true,
  },
  /* Events have no split payment plan. */
  event: {
    label: "Event",
    pricingPath: (productId) => `/dashboard/event_product/${productId}/product-price/`,
    supportedPlans: [
      "one-time-standard",
      "subscription-standard",
      "donation-one-time",
      "donation-recurring",
    ],
    verified: true,
  },
  "group-chat": {
    label: "Group chat",
    pricingPath: (productId) => `/dashboard/group/${productId}/product-price/`,
    supportedPlans: CORE_PLANS,
    verified: true,
  },
  /* The id is the private chat entry's id. */
  "private-chat": {
    label: "Private chat",
    pricingPath: (productId) => `/dashboard/private-chat/${productId}/product-price/`,
    supportedPlans: CORE_PLANS,
    verified: true,
  },
};

/* Only these two show the trial switches and the "Course/Membership Expiry" of a one-time standard price. */
const PRODUCTS_WITH_TRIAL: ReadonlyArray<PricingProductType> = ["course", "membership"];

/* Only the course shows an expiry on a one-time tiered price (the membership form has none). */
const PRODUCTS_WITH_TIERED_EXPIRY: ReadonlyArray<PricingProductType> = ["course"];

export const supportsPlan = (product: PricingProductType, plan: PricingPlanType): boolean =>
  PRODUCT_PRICING[product].supportedPlans.includes(plan);

/* The settings the form of `plan` shows for `product`. Empty when the product does not support the plan. */
export const getPlanSettings = (
  product: PricingProductType,
  plan: PricingPlanType,
): ReadonlyArray<PricingSetting> => {
  if (!supportsPlan(product, plan)) return [];
  return BASE_PLAN_SETTINGS[plan].filter((setting) => {
    if (setting === "trial") return PRODUCTS_WITH_TRIAL.includes(product);
    if (plan === "one-time-standard" && setting === "expiry")
      return PRODUCTS_WITH_TRIAL.includes(product);
    if (plan === "one-time-tiered" && setting === "expiry")
      return PRODUCTS_WITH_TIERED_EXPIRY.includes(product);
    return true;
  });
};

export const canRepeatPlan = (plan: PricingPlanType): boolean => PRICING_PLAN_MAX_ACTIVE[plan] > 1;
