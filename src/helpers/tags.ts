/*
 * Tag registry: the single source of truth for every test tag.
 * Specs must use `Tag.X`, never a raw string (CLAUDE.md section 4).
 */
export const Tag = {
  /* Suite tags */
  Smoke: "@smoke",
  Sanity: "@sanity",
  Regression: "@regression",
  Feature: "@feature",
  E2E: "@e2e",

  /* Role tags (guest = logged-out visitor) */
  Owner: "@owner",
  Student: "@student",
  Guest: "@guest",

  /* Polarity tags */
  Positive: "@positive",
  Negative: "@negative",

  /*
   * Feature tags: added here, with the human's approval, as features get covered.
   * Tag by what a test exercises, so `pnpm tag @login` runs it wherever login is used.
   */
  Authentication: "@authentication",
  Login: "@login",
  Logout: "@logout",
  Session: "@session",
  Authorization: "@authorization",

  /*
   * Coaching feature tags (names approved by the human on 2026-11-15).
   * @coaching-type is on every test that exercises a coaching type, so one command runs them all.
   */
  Coaching: "@coaching",
  CoachingProgramCreation: "@coaching-program-creation",
  CoachingProgramEdit: "@coaching-program-edit",
  CoachingProgramManagement: "@coaching-program-management",
  CoachingCategory: "@coaching-category",
  CoachingType: "@coaching-type",
  CoachingAccess: "@coaching-access",
  CoachingAfterCheckout: "@coaching-after-checkout",
  OneToOneBooking: "@one-to-one-booking",

  /*
   * Pricing feature tags (requested by the human on 2026-11-16). @pricing is on every test that
   * touches the shared pricing section, whichever product it is on.
   */
  Pricing: "@pricing",
  CoachingPricing: "@coaching-pricing",
  PricingPlanLimit: "@pricing-plan-limit",
  PricingValidation: "@pricing-validation",
} as const;
