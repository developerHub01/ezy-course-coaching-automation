/*
 * Toast texts and validation messages of the shared pricing section. Controllers wait for the toasts
 * as proof that an action finished, and specs assert the validation messages as expected results.
 */
export const PricingMessage = {
  markedDefault: "Price set as default successfully",
  madePrivate: "Price is made private",
  archived: "Price Archive successfully",
  deleted: "Price deleted successfully",
  linkCopied: "Link copied to clipboard",
} as const;

/* Messages under a field when Create is pressed on an empty form. */
export const PricingValidation = {
  priceRequired: "Please input price!",
  expiryRequired: "Please input expiry!",
  billingPeriodRequired: "Interval is required!",
  tierPriceRequired: "Per unit price is required",
  flatPriceRequired: "Price is required",
} as const;
