/*
 * Toast texts of the coaching program screens. Controllers wait for them as proof that an action
 * finished, and specs assert them as the expected result, so the text lives in one place.
 */
export const CoachingProgramMessage = {
  created: "Coaching Program Created Successfully",
  updated: "Coaching Program Updated Successfully",
  deleted: "Program deleted successfully",
} as const;
