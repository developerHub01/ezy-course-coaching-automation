/*
 * Texts of the coaching category screens. Controllers wait for the toasts as proof that an action
 * finished, and specs assert them as the expected result, so each text lives in one place.
 * Saving an edit shows no message at all.
 */
export const CoachingCategoryMessage = {
  created: "Category created successfully",
  deleted: "1 category deleted",
  nameRequired: "'name' is required",
  nameTooLong: "Name must be less than 30 characters.",
} as const;
