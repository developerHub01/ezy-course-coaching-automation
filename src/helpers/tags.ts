/**
 * Tag registry: the single source of truth for every test tag.
 * Specs must use `Tag.X`, never a raw string (CLAUDE.md section 4).
 */
export const Tag = {
  // Suite tags
  Smoke: "@smoke",
  Sanity: "@sanity",
  Regression: "@regression",
  Feature: "@feature",
  E2E: "@e2e",

  // Role tags
  Owner: "@owner",
  Student: "@student",

  // Polarity tags
  Positive: "@positive",
  Negative: "@negative",

  // Feature tags: added here, with the human's approval, as features get covered.
  // Example: StudentManagement: "@student-management",
} as const;
