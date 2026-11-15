import { faker } from "@faker-js/faker";

export type CoachingType =
  "One to One Coaching" | "Week Based" | "Continuous" | "Session Based" | "Evergreen";

export type CoachingAccess = "Public" | "Private" | "Hidden" | "Restricted";

export type SubmissionVisibility = "All" | "Own";

export type FreeSlotsRenewalCycle = "One-time" | "Weekly" | "Monthly" | "Yearly";

/*
 * The shared demo tenant already holds this category and appointment, and creating them is not
 * automated yet. Override them in a test if the tenant data changes.
 */
export const DEFAULT_COACHING_CATEGORY = "Testing for research";
export const DEFAULT_COACHING_APPOINTMENT = "Free appoin";
export const ALTERNATIVE_COACHING_APPOINTMENT = "Test reschedule sync";
export const DEFAULT_COACHING_INTERNAL_PAGE = "QA After Checkout Test Page (safe to delete)";
export const DEFAULT_COACHING_INTERNAL_PAGE_SLUG = "qa-after-checkout-test-page-safe-to-delete";

export interface CoachingBookingData {
  freeSlots: number;
  renewalCycle: FreeSlotsRenewalCycle;
  allowAdditionalSessions: boolean;
  appointment: string;
}

/* Where a student goes after checkout: a page of the site (chosen by title) or any web address. */
export interface InternalAfterCheckoutData {
  kind: "internal";
  pageTitle: string;
}

export interface ExternalAfterCheckoutData {
  kind: "external";
  url: string;
}

export type AfterCheckoutData = InternalAfterCheckoutData | ExternalAfterCheckoutData;

/*
 * Everything the create/edit form can hold. Optional fields only exist for some coaching types
 * (see docs/product/coaching.md), so a test sets them only where the type shows them.
 */
export interface CoachingProgramData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  access: CoachingAccess;
  studentLimit: number;
  coachingType: CoachingType;
  submissionVisibility?: SubmissionVisibility;
  allowSubmissionOnPreviousSessions?: boolean;
  allowEnrollmentInCurrentBatch?: boolean;
  habitTab?: boolean;
  booking?: CoachingBookingData;
  afterCheckout?: AfterCheckoutData;
}

/*
 * The title carries a "QA-" prefix and a random suffix so a test can find and delete only its own
 * program on the shared tenant. Session Based is the default type because it has the fewest extras.
 */
export const buildCoachingProgram = (
  overrides: Partial<CoachingProgramData> = {},
): CoachingProgramData => ({
  title: `QA-${faker.commerce.productAdjective()} Coaching ${faker.string.alphanumeric(6)}`,
  description: faker.lorem.sentence(),
  shortDescription: faker.lorem.sentence({
    min: 3,
    max: 8,
  }),
  category: DEFAULT_COACHING_CATEGORY,
  access: "Public",
  studentLimit: faker.number.int({
    min: 2,
    max: 20,
  }),
  coachingType: "Session Based",
  ...overrides,
});

export const buildCoachingBooking = (
  overrides: Partial<CoachingBookingData> = {},
): CoachingBookingData => ({
  freeSlots: 1,
  renewalCycle: "Monthly",
  allowAdditionalSessions: false,
  appointment: DEFAULT_COACHING_APPOINTMENT,
  ...overrides,
});

export const buildInternalAfterCheckout = (
  overrides: Partial<InternalAfterCheckoutData> = {},
): InternalAfterCheckoutData => ({
  kind: "internal",
  pageTitle: DEFAULT_COACHING_INTERNAL_PAGE,
  ...overrides,
});

export const buildExternalAfterCheckout = (
  overrides: Partial<ExternalAfterCheckoutData> = {},
): ExternalAfterCheckoutData => ({
  kind: "external",
  url: `https://example.com/thank-you-${faker.string.alphanumeric(6).toLowerCase()}`,
  ...overrides,
});
