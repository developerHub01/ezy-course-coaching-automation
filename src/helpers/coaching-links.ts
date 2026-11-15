import { DEFAULT_COACHING_INTERNAL_PAGE_SLUG } from "@/helpers/data/coaching-program.factory";
import { getSiteUrl } from "@/helpers/env";

/* Where a student goes after checkout when the owner sets nothing. */
export const DEFAULT_AFTER_CHECKOUT_LINK = new URL(
  "/student/dashboard/coaching-programs",
  getSiteUrl(),
).href;

/* The address of the tenant's test page that the tests use as the internal After Checkout page. */
export const INTERNAL_AFTER_CHECKOUT_LINK = new URL(
  `/${DEFAULT_COACHING_INTERNAL_PAGE_SLUG}`,
  getSiteUrl(),
).href;
